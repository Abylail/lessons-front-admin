<template>
  <modal name="remove-branch" size="small" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="remove-branch">
      <div class="remove-branch__text">Вы уверены что хотите удалить <strong>{{ branch.address }}</strong>?</div>
      <div class="remove-branch__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="red" dark :loading="isLoading" @click="deleteHandle()">Удалить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "removeBranchModal",
  data: () => ({
    // Информация учителя
    branch: {},

    isLoading:false,
  }),
  methods: {
    ...mapActions({
      _deleteBranch: "center/branches/deleteBranch",
    }),

    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.branch) {
        this.branch = {...this.$modal.$payload.branch};
      }
    },

    // Очистка информации
    clear() {
      this.branch = {};
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("remove-branch");
    },

    // Удалить кнопка
    async deleteHandle() {
      this.isLoading = true;
      await this._deleteBranch(this.branch);
      this.closeSelf();
      this.isLoading = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.remove-branch {
  padding-top: 10px;

  &__text {
    height: 40px;
    padding-right: 60px;
    margin-bottom: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
