<template>
  <div class="step-1">

    <v-text-field
      label="Сотовый номер"
      v-model="userInfo.phone"
      v-mask="'+7 (###) ###-##-##'"
      :error-messages="error.phone"
      ref="phoneInput"
      outlined
      dense
    />

    <v-btn
      :loading="isLoading"
      color="primary"
      large
      @click="submitHandle()"
    >Отправить смс</v-btn>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "step1",
  data: () => ({

    // Информацию пользователя
    userInfo: {
      phone: null,
    },

    // Ошибки
    error: {},

    isLoading: false,
  }),
  watch: {
    userInfo: {
      deep: true,
      handler(val) {

        // Валидирую если есть ошибка
        if (Object.keys(this.error).length) {
          this.validate();
        }
      }
    }
  },
  methods: {
    ...mapActions({
      _sendSmsCode: "registration/sendSmsCode",
    }),

    // Валидация (true -> все хорошо)
    validate() {
      this.error = {};

      // Отсутсвует телефон
      if (!this.userInfo.phone) {
        this.error.phone = "Введите сотовый номер";
        return false;
      }

      // Неправильный телефон
      if (this.userInfo.phone.length !== 18) {
        this.error.phone = "Введите корректный сотовый номер";
        return false;
      }

      return true;
    },
    async submitHandle() {
      if (this.validate()) {
        this.isLoading = true;
        await this._sendSmsCode({phone: this.userInfo.phone});
        this.isLoading = false;
        this.$emit("next");
      }
    }
  },
  mounted() {
    // Что бы клава была для телефона
    this.$refs.phoneInput.$refs.input.setAttribute("inputmode", "tel");
  }
}
</script>

<style lang="scss" scoped>
.step-1 {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
