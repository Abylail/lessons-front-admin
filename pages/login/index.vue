<template>
  <div class="login-page" @keyup.enter="loginHandle()">

    <v-card class="login-page__card">
      <v-card-title>Вход</v-card-title>
      <div class="login-page__main">

        <!-- phone -->
        <v-text-field
          label="Телефон"
          v-mask="'+7 (###) ###-##-##'"
          v-model="authData.phone"
          ref="phoneInput"
          outlined
        />

        <!-- PASSWORD -->
        <v-text-field
          label="Пароль"
          v-model="authData.password"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          outlined
          @click:append="showPassword = !showPassword"
        />

        <v-btn color="primary" block @click="loginHandle()">Войти</v-btn>

        <div class="login-page__registration">
          <nuxt-link to="/registration">Зарегестрироваться</nuxt-link>
        </div>

      </div>
    </v-card>

  </div>
</template>

<script>
import {mapActions} from "vuex";
export default {
  name: "index",
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
  mounted() {
    // Что бы клава была для телефона
    this.$refs.phoneInput.$refs.input.setAttribute("inputmode", "tel");
  }
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
