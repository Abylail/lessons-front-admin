<template>
  <modal name="edit-category" size="small" close-button @onShow="getPayload()" @onHide="clear()">

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
    // Новая ли категория
    isNewCategory() {
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
      if (!this.category.ru.name) {
        return false;
      }
      if (!this.category.kz.name) {
        return false;
      }
      return true;
    },
    // Сохранить категорию
    async saveCategory() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewCategory) await this._createCategory(this.category);
        else await this._updateCategory(this.category);
        this.closeSelf();
      }
      this.isLoading = false;
    },
  }
}
</script>

<style scoped>

</style>
