<template>
  <div class="login-page">

    <v-card class="login-page__card" v-if="step === 0">
      <v-card-title>Сброс пароля</v-card-title>
      <div class="login-page__main">

        <!-- phone -->
        <base-phone-input
          label="Телефон"
          v-model="authData.phone"
          ref="phoneInput"
          outlined
          dense
        />

        <v-btn color="primary" :loading="isLoading" block @click="sendCodeHandle()">Отправить смс код</v-btn>
      </div>
    </v-card>

    <v-card class="login-page__card" v-if="step === 1">
      <v-card-title>Введите смс код <br/>и новый пароль</v-card-title>
      <div class="login-page__main">

        <!-- OTP -->
        <v-otp-input
          ref="input"
          v-model="authData.sms_code"
          length="4"
          type="number"
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

        <v-btn color="primary" :loading="isLoading" block @click="submit()">Сохранить пароль</v-btn>
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

    step: 0,

    authData: {
      phone: null,
      password: null,
      sms_code: null
    },

    errors: {
      phone: null,
      password: null,
    },
  }),
  methods: {
    ...mapActions({
      _sendSmsCode: "auth/sendSmsCode",
      _resetPass: "auth/resetPass"
    }),
    validate() {

    },
    async sendCodeHandle() {
      this.isLoading = true;
      const isSuccess =  await this._sendSmsCode({
        phone: this.authData.phone,
      })
      if (isSuccess) this.step++;
      this.isLoading = false;
    },

    async submit() {
      this.isLoading = true;
      const isSuccess = await this._resetPass(this.authData);
      if (isSuccess) {
        this.$toast.success("Пароль обновленн");
        this.$router.push("/login")
      }
      this.isLoading = false;
    },
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
