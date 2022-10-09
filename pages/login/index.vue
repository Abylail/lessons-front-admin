<template>
  <div class="login-page" @keyup.enter="loginHandle()">

    <v-card class="login-page__card">
      <v-card-title>Вход</v-card-title>
      <div class="login-page__main">

        <!-- USERNAME -->
        <v-text-field
          label="Логин"
          v-model="username"
          outlined
        />

        <!-- PASSWORD -->
        <v-text-field
          label="Пароль"
          v-model="password"
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
    username: "",
    password: "",
    showPassword: false,
    isLoading: false
  }),
  methods: {
    ...mapActions({
      _login: "auth/login"
    }),
    async loginHandle() {
      if (!this.username || !this.password) return;
      this.isLoading = true;
      this.showPassword = true;
      await this._login({
        username: this.username,
        password: this.password,
      })
      this.isLoading = false;
      this.$router.push("/");
    }
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
