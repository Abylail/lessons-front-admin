<template>
  <modal name="edit-category" size="small" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-category">
      <h2>Категория</h2>
      <div class="edit-category__form">
        <v-text-field label="Название на русском" v-model="category.name" :readonly="!isNew" outlined dense/>
        <v-text-field label="Иконка mdi" v-model="category.icon_mdi" hint="Пример: mdi-pencil" outlined dense/>
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
  name: "editCategoryModal",
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
      _createCategory: "admin/categories/createCategory",
      _updateCategory: "admin/categories/updateCategory",
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
      this.$modal.hide("edit-category");
    },
    // Валидация информации категории
    async validate() {
      if (!this.category.name) {
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
.edit-category {

  &__form {
    margin-top: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
