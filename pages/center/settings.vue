<template>
  <div class="settings page">

    <!-- Информация пользователя -->
    <user-info/>

    <v-divider class="mt-3 mb-3"/>

    <!-- Информация центра -->
    <div class="settings__center">
      <h2 class="settings__title">Информация центра</h2>
      <div>
        <h2 class="settings__sub-title">Информация на русском</h2>
        <v-text-field label="Название центра (Рус)" v-model="centerInfo.name" outlined dense/>
        <v-textarea label="Описание центра (Рус)" v-model="centerInfo.description" outlined dense/>
      </div>
    </div>

<!--    <v-divider class="mt-3 mb-3"/>-->

    <!-- Контактная информация -->
    <div class="settings__center">
      <h2 class="settings__sub-title">Контакты</h2>
      <div class="relative-columns-2">
        <v-text-field label="Ссылка на инстаграм" v-model="centerInfo.instagram_url" outlined dense/>
        <v-text-field label="Email" v-model="centerInfo.email" outlined dense/>
      </div>

      <div class="relative-columns-2">
        <v-text-field label="Телефон (для звонков)" v-model="centerInfo.call_phone" outlined dense/>
        <v-text-field label="Телефон whatsapp" v-model="centerInfo.whatsapp_phone" outlined dense/>
      </div>

    </div>

    <div class="settings__center">
      <h2 class="settings__sub-title">Режим работы</h2>
      <div class="relative-columns-2">
        <v-text-field label="Начало" v-model="centerInfo.start_time" outlined dense/>
        <v-text-field label="Конец" v-model="centerInfo.end_time" outlined dense/>
      </div>
    </div>

          <v-btn
            color="primary"
            :loading="centerInfoLoading"
            block
            @click="saveCenterInfo()"
          >Сохранить информацию центра</v-btn>
  </div>
</template>

<script>
import { activeCities } from "@/config/lists";
import {mapActions, mapGetters} from "vuex";
import Slide from "../../components/transitions/slide";
import UserInfo from "../../components/common/user/userInfo";

export default {
  name: "settings",
  components: {UserInfo, Slide},
  data: () => ({
    isLoading: false,

    // Список городов
    activeCities,

    // Центр
    centerInfo: {}, //
    centerInfoLoading: false,
  }),
  computed: {
    ...mapGetters({
      _centerInfo: "center/getCenterInfo",
    }),
  },
  watch: {
    _centerInfo: {
      handler(val) {
        if (!val) return;
        this.centerInfo = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    },
  },
  methods: {
    ...mapActions({
      _saveCenterInfo: "center/saveCenterInfo",
      _fetchCenterInfo: "center/fetchCenterInfo",
    }),

    // Валидация информации центра
    async validateCenterInfo() {
      return true;
    },

    // Сохранения информации центра
    async saveCenterInfo() {
      this.centerInfoLoading = true;
      if (await this.validateCenterInfo()) await this._saveCenterInfo(this.centerInfo);
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

  &__contact-card {
    padding: 15px;

    &:not(:first-child) {
      margin-top: 20px;
    }
  }

  &__contact-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

}
</style>
