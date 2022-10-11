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

    <v-select
      label="Ваша роль"
      v-model="userInfo.role"
      :items="roles"
      item-value="code"
      item-text="name"
      outlined
      dense
    />

    <v-btn
      color="primary"
      large
      @click="submitHandle()"
    >Продолжить</v-btn>
  </div>
</template>

<script>
import { role } from "@/config/standarts";

export default {
  name: "step1",
  data: () => ({

    // Информацию пользователя
    userInfo: {
      phone: null,
      role: null,
    },

    // Ошибки
    error: {},
  }),
  computed: {
    roles() {
      return Object.keys(role).map(key => role[key]);
    }
  },
  watch: {
    userInfo: {
      deep: true,
      handler(val) {
        if (Object.keys(this.error).length) {
          this.validate();
        }
      }
    }
  },
  methods: {

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

      // Отсутсвует роль
      if (!this.userInfo.role) {
        this.error.role = "Выберите роль";
        return false;
      }

      return true;
    },
    submitHandle() {
      if (this.validate()) {
        this.$emit("next");
      }
    }
  },
  mounted() {
    // Что бы клава была для телефона
    this.$refs.phoneInput.$refs.input.setAttribute("inputmode", "tel");
    this.$nextTick(() => {
      this.$refs.phoneInput.focus();
    })
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
