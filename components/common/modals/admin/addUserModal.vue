<template>
  <modal name="add-user" size="small" :close-on-out-click="false" close-button @onShow="onShow()" @onHide="clear()">
    <div class="add-user">
      <h2>Новый пользователь</h2>
      <div class="add-user__form">
        <v-text-field
          label="Фамилия"
          v-model="user.last_name"
          outlined dense
        />
        <v-text-field
          label="Имя"
          v-model="user.first_name"
          outlined dense
        />
        <v-text-field
          label="Телефон"
          ref="phoneInput"
          v-model="user.phone"
          v-mask="'+7 (###) ###-##-##'"
          outlined dense
        />
        <v-text-field
          label="Пароль"
          v-model="user.password"
          outlined dense
        />
      </div>
      <div class="add-user__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveCategory()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "addUserModal",
  data: () => ({
    user: {},

    isLoading: false,
  }),
  methods: {
    ...mapActions({
      _createUser: "users/createUser"
    }),

    // Закрыть себя
    closeSelf() {
      this.$modal.hide("add-user");
    },

    validate() {
      return true;
    },

    onShow() {
      this.$nextTick(() => {
        this.$refs.phoneInput.$refs.input.setAttribute("inputmode", "tel");
      })
    },

    // Очистить
    clear() {
      this.user = {};
    },

    // Сохранить
    async saveCategory() {
      this.isLoading = true;
      let success = false;
      if (this.validate()) {
        success = await this._createUser(this.user);
      }
      if (success) this.closeSelf()
      this.isLoading = false;
    },
  },
}
</script>

<style lang="scss" scoped>
.add-user {

  &__form {
    margin-top: 20px;
  }

}
</style>
