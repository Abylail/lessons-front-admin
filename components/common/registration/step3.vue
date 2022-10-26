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
import {mapActions, mapGetters} from "vuex";

export default {
  name: "step3",
  data: () => ({
    userInfo: {
      password: null,
      repeatPassword: null,
    },
  }),
  computed: {
    ...mapGetters({
      roles: "getRoles"
    })
  },
  methods: {
    ...mapActions({
      _fetchRoles: "fetchRoles",
      _setPassword: "registration/setPassword",
    }),
    async validate() {
      return true;
    },
    async submitHandle() {
      if (await this.validate()) {
        await this._setPassword({password: this.userInfo.password, role: this.userInfo.role});
        this.$router.push("/");
      }
    }
  },
  mounted() {
    this._fetchRoles();
  }
}
</script>

<style scoped>

</style>
