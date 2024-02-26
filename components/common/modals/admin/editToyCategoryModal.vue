<template>
  <modal name="edit-toy-category" size="small" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-toy-category">
      <h2>Категория игрушек</h2>
      <div class="edit-toy-category__form">
        <v-text-field label="Название (рус)" v-model="category.name_ru" outlined dense/>
        <v-text-field label="Название (каз)" v-model="category.name_kz" outlined dense/>
        <v-text-field label="Иконка mdi" v-model="category.icon_mdi" hint="Пример: mdi-pencil" :prepend-icon="category.icon_mdi" outlined dense hide-details/>
        <a class="d-block mb-5 mt-2" href="https://pictogrammers.com/library/mdi/" target="_blank">Ссылка на иконки</a>
      </div>
      <div class="edit-teacher__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveCategory()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "editToyCategoryModal",
  data: () => ({
    // Информация категории
    category: {},

    isLoading: false,
  }),
  computed: {
    isNew() {
      return !this.category.id;
    }
  },
  methods: {
    ...mapActions({
      _createCategory: "admin/toysCategories/createCategory",
      _updateCategory: "admin/toysCategories/updateCategory",
    }),
    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.category) {
        this.category = {...this.$modal.$payload.category};
      }
    },
    // Очистить
    clear() {
      this.category = {};
    },
    // Закрыть себя (Модалку)
    closeSelf() {
      this.$modal.hide("edit-toy-category");
    },
    // Валидация информации категории
    async validate() {
      if (!this.category.name_ru || !this.category.name_ru) {
        this.$toast.error("Введите имя!")
        return false;
      }
      return true;
    },
    // Сохранить категорию
    async saveCategory() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNew) await this._createCategory(this.category);
        else await this._updateCategory(this.category);
        this.closeSelf();
      }
      this.isLoading = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.edit-toy-category {

  &__form {
    margin-top: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
