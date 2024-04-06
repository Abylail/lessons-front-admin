<template>
  <div class="login-page" @keyup.enter="loginHandle()">

    <v-card class="login-page__card">
      <v-card-title>Введите номер</v-card-title>
      <div class="login-page__main">

        <!-- phone -->
        <base-phone-input
          label="Телефон"
          v-model="authData.phone"
          ref="phoneInput"
          outlined
        />

        <v-btn color="primary" :loading="isLoading" block @click="loginHandle()">Отправить</v-btn>

      </div>
    </v-card>

  </div>
</template>

<script>
import {mapActions} from "vuex";
import BasePhoneInput from "@/components/base/BasePhoneInput";
export default {
  name: "index",
  components: {BasePhoneInput},
  layout: "empty",
  data: () => ({
    phone: "",
    password: "",
    showPassword: false,
    isLoading: false,

    authData: {
      phone: null,
      password: null,
    },

    errors: {
      phone: null,
      password: null,
    },
  }),
  methods: {
    ...mapActions({
      _login: "auth/login"
    }),
    validate() {

    },
    async loginHandle() {
      if (!this.authData.phone || !this.authData.password) return;
      this.isLoading = true;
      this.showPassword = false;
      await this._login({
        phone: this.authData.phone,
        password: this.authData.password,
      })
      this.isLoading = false;
      this.$router.push("/");
    }
  },
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;

  &__card {
    margin: auto;
    padding: 20px;
    width: 90%;
    max-width: 350px;
  }

  &__registration {
    margin-top: 10px;
    text-align: center;
  }

}
</style>
