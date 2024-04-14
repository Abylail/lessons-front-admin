<template>
  <modal name="edit-category-pack" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-category-pack">
      <h2>Категория</h2>
      <div class="edit-category-pack__form">
        <div class="relative-columns-2">
          <v-text-field label="Название (рус)" v-model="category.name_ru" outlined dense/>
          <v-text-field label="Название (каз)" v-model="category.name_kz" outlined dense/>
        </div>
        <div class="relative-columns-2">
          <v-text-field label="Описание (рус)" v-model="category.description_ru" outlined dense/>
          <v-text-field label="Описание (каз)" v-model="category.description_kz" outlined dense/>
        </div>
        <v-text-field label="Иконка mdi" v-model="category.icon_mdi" hint="Пример: mdi-pencil" :prepend-icon="category.icon_mdi" outlined dense hide-details/>
        <a class="d-block mb-5 mt-2" href="https://pictogrammers.com/library/mdi/" target="_blank">Ссылка на иконки</a>
      </div>
      <div class="edit-category-pack__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn v-if="!isNew" color="error" outlined @click="deleteCategory()"><v-icon>mdi-delete</v-icon></v-btn>
        <v-btn color="primary" :loading="isLoading" @click="saveCategory()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "editCategoryPack",
  data: () => ({
    category: {},

    isLoading: false,
  }),
  computed: {
    isNew() {
      return !this.category?.id;
    }
  },
  methods: {
    ...mapActions({
      _createCategoryPack: "admin/toyPacks/createCategory",
      _updateCategoryPack: "admin/toyPacks/updateCategory",
      _deleteCategoryPack: "admin/toyPacks/deleteCategory"
    }),

    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.category) {
        this.category = {...this.$modal.$payload.category};
      }
    },

    async deleteCategory() {
      this.isLoading = true;
      if (confirm("Вы точно хотите удалить категорию?")) await this._deleteCategoryPack(this.category);
      this.isLoading = false;
      this.closeSelf();
    },

    clear() {
      this.category = {};
    },

    async saveCategory() {
      this.isLoading = true;
      if (this.isNew) await this._createCategoryPack(this.category);
      else await this._updateCategoryPack(this.category);
      this.closeSelf();
      this.isLoading = false;
    },

    closeSelf() {
      this.$modal.hide('edit-category-pack')
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-category-pack {

  &__form {
    margin-top: 20px;
  }

}
</style>
