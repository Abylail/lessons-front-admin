<template>
  <modal name="remove-user" size="small" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="remove-user">
      <div class="remove-user__text">Вы уверены что хотите удалить пользователя <strong>{{ user.first_name }} {{ user.last_name }} ({{ user.phone }})</strong>?</div>
      <div class="remove-user__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="red" dark :loading="isLoading" @click="deleteHandle()">Удалить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "removeUserModal",
  data: () => ({
    user: {},
    isLoading: false,
  }),
  methods: {
    ...mapActions({
      _deleteUser: "users/deleteUser",
    }),

    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.user) {
        this.user = {...this.$modal.$payload.user};
      }
    },

    clear() {
      this.user = {};
    },

    closeSelf() {
      this.$modal.hide("remove-user");
    },

    // Удалить кнопка
    async deleteHandle() {
      this.isLoading = true;
      await this._deleteUser(this.user.id);
      this.closeSelf();
      this.isLoading = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.remove-user {
  padding-top: 40px;

  &__text {
    max-width: 400px;
    margin-bottom: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
