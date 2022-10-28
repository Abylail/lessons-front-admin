<template>
  <div class="user-info">
    <h2 class="user-info__title mb-3">Информация пользователя</h2>
    <div class="relative-columns-3">
      <v-text-field v-model="userInfo.last_name" label="Фамилия" outlined dense/>
      <v-text-field v-model="userInfo.first_name" label="Имя" outlined dense/>
      <v-btn color="primary" :loading="isLoading" @click="saveUserInfo()">Сохранить пользователя</v-btn>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "userInfo",
  data: () => ({
    // Информация юзера
    userInfo: {},
    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      _userInfo: "auth/getUserInfo",
    }),
  },
  watch: {
    _userInfo: {
      handler(val) {
        if (!val) return;
        this.userInfo = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    },
  },
  methods: {
    ...mapActions({
      _saveUserInfo: "auth/saveUserInfo",
    }),

    // Валидация информации пользователя
    validate() {
      if (!this.userInfo.last_name) {
        this.$toast.error("Введите фамилию");
        return false;
      }
      else if (!this.userInfo.first_name) {
        this.$toast.error("Введите имя");
        return false;
      }
      return true;
    },

    // Сохранить информацию пользователя
    async saveUserInfo() {
      this.isLoading = true;
      if (this.validate()) await this._saveUserInfo(this.userInfo);
      this.isLoading = false;
    },
  }
}
</script>

<style scoped>

</style>
