<template>
  <modal name="remove-category" size="small" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="remove-category">
      <div class="remove-category__text">Вы уверены что хотите удалить <strong>{{ category.name }}</strong>?</div>
      <div class="remove-category__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="red" dark :loading="isLoading" @click="deleteHandle()">Удалить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "removeCategoryModal",
  data: () => ({
    // Информация категории
    category: {},

    isLoading:false,
  }),
  methods: {
    ...mapActions({
      _deleteCategory: "admin/categories/deleteCategory",
    }),

    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.category) {
        this.category = {...this.$modal.$payload.category};
      }
    },

    // Очистка информации
    clear() {
      this.category = {};
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("remove-category");
    },

    // Удалить кнопка
    async deleteHandle() {
      this.isLoading = true;
      await this._deleteCategory(this.category);
      this.closeSelf();
      this.isLoading = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.remove-category {
  padding-top: 40px;

  &__text {
    max-width: 300px;
    margin-bottom: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
