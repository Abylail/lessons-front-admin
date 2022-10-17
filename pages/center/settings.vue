<template>
  <div class="settings page">

    <!-- Информация пользователя -->
    <div class="settings__user">
      <h2 class="settings__title">Информация пользователя</h2>
      <div class="relative-columns-3">
        <v-text-field v-model="userInfo.last_name" label="Фамилия" outlined dense/>
        <v-text-field v-model="userInfo.first_name" label="Имя" outlined dense/>
        <v-btn color="primary" :loading="userInfoLoading" @click="saveUserInfo()">Сохранить пользователя</v-btn>
      </div>
    </div>

    <v-divider class="mt-3 mb-3"/>

    <!-- Информация центра -->
    <div class="settings__center">
      <h2 class="settings__title">Информация центра</h2>
      <div class="relative-columns-2">
        <div>
          <h2 class="settings__sub-title">Информация на русском</h2>
          <v-text-field label="Название центра (Рус)" outlined dense/>
          <v-textarea label="Описание центра (Рус)" outlined dense/>
        </div>
        <div>
          <h2 class="settings__sub-title">Информация на казахском</h2>
          <v-text-field label="Название центра (Каз)" outlined dense/>
          <v-textarea label="Описание центра (Каз)" outlined dense/>
        </div>
      </div>
      <v-btn
        class="mt-3"
        color="primary"
        :loading="centerInfoLoading"
        block
        @click="saveCenterInfo()"
      >Сохранить информацию центра</v-btn>
    </div>

  </div>
</template>

<script>
import { activeCities } from "@/config/lists";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "settings",
  data: () => ({
    isLoading: false,

    // Список городов
    activeCities,

    // Пользователь
    userInfo: {},
    userInfoLoading: false,

    // Центрер
    centerInfo: {},
    centerInfoLoading: false,
  }),
  computed: {
    ...mapGetters({
      _userInfo: "auth/getUserInfo",
      _centerInfo: "center/getCenterInfo",
    })
  },
  watch: {
    _userInfo: {
      handler(val) {
        this.userInfo = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    },
    _centerInfo: {
      handler(val) {
        this.centerInfo = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      _saveUserInfo: "auth/saveUserInfo",
      _saveCenterInfo: "center/saveCenterInfo",
      _fetchCenterInfo: "center/fetchCenterInfo",
    }),

    // Валидация информации пользователя
    async validateUserInfo() {
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

    // Сохранение информации пользователя
    async saveUserInfo() {
      this.userInfoLoading = true;
      if (await this.validateUserInfo()) await this._saveUserInfo(this.userInfo);
      this.userInfoLoading = false;
    },

    // Сохранения информации центра
    async saveCenterInfo() {
      this.centerInfoLoading = true;
      this.centerInfoLoading = false;
    },

    // Запросить информацию центра
    async fetchCenterInfo() {
      this.centerInfoLoading = true;
      await this._fetchCenterInfo();
      this.centerInfoLoading = false;
    },
  },
  mounted() {
    this.fetchCenterInfo();
  }
}
</script>

<style lang="scss" scoped>
.settings {

  &__title {
    margin-bottom: 20px;
  }

  &__sub-title {
    font-size: 16px;
    margin-bottom: 10px;
  }

}
</style>
