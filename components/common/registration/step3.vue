<template>
  <div class="step-3">

    <v-select
      label="Ваша роль"
      v-model="userInfo.role"
      :items="roles"
      item-value="code"
      item-text="name"
      outlined
      dense
    />

    <v-text-field
      label="Пароль"
      v-model="userInfo.password"
      type="password"
      ref="password"
      outlined
      dense
    />

    <v-text-field
      label="Повторите пароль"
      v-model="userInfo.repeatPassword"
      type="password"
      outlined
      dense
    />

    <v-btn
      color="primary" block
      @click="submitHandle()"
    >Зарегестрироваться</v-btn>

  </div>
</template>

<script>
export default {
  name: "step3",
  data: () => ({
    userInfo: {
      password: null,
      repeatPassword: null,
    },
    roles: [{code: "center", name: "Детский центр"}]
  }),
  methods: {
    submitHandle() {
      this.$router.push("/");
    }
  },
}
</script>

<style scoped>

</style>
