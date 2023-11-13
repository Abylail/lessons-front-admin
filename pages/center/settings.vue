<template>
  <div class="settings page">

    <!-- Информация пользователя -->
    <user-info/>

    <v-divider class="mt-3 mb-3"/>

    <div v-if="!isExist">
      К вам не привязан центр, обратитесь к администратору
    </div>

    <!-- Информация центра -->
    <div v-if="isExist">

    <div class="settings__center">
      <h2 class="settings__title">Информация центра</h2>
      <div>
        <h2 class="settings__sub-title">Информация</h2>
        <v-text-field label="Название центра" v-model="centerInfo.name" outlined dense/>
        <v-textarea label="Описание центра" v-model="centerInfo.description" outlined dense/>
      </div>
    </div>

    <!-- Контактная информация -->
    <div class="settings__center">
      <h2 class="settings__sub-title">Контакты</h2>
      <div class="relative-columns-2">
        <v-text-field label="Ссылка на инстаграм" v-model="centerInfo.instagram_url" outlined dense/>
        <v-text-field label="Email" v-model="centerInfo.email" outlined dense/>
      </div>

      <div class="relative-columns-2">
        <base-phone-input label="Телефон (для звонков)" v-model="centerInfo.call_phone" outlined dense/>
        <base-phone-input label="Телефон whatsapp" v-model="centerInfo.whatsapp_phone" outlined dense/>
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

    <v-divider class="mt-3 mb-3"/>

    <h2 class="settings__title">Медиа центра</h2>

    <div class="settings__center">
      <h2 class="settings__sub-title">Логотип центра</h2>
      <base-photo-input
        :value="centerInfo.logo"
        :loading="isLogoLoading"
        :max-width="500"
        @upload="inputLogoHandle($event)"
      />
    </div>

    <div class="settings__center mt-3">
      <h2 class="settings__sub-title">Фотки центра</h2>
      <base-photo-input
        :value="centerInfo.photos"
        :loading="isPhotoLoading"
        multiple
        @upload="inputPhotoHandle($event)"
        @remove="removePhotoHandle($event)"
      />
    </div>

    </div>
  </div>
</template>

<script>
import { activeCities } from "@/config/lists";
import {mapActions, mapGetters} from "vuex";
import Slide from "../../components/transitions/slide";
import UserInfo from "../../components/common/user/userInfo";
import BasePhotoInput from "@/components/base/BasePhotoInput";
import BasePhoneInput from "@/components/base/BasePhoneInput";

export default {
  name: "settings",
  components: {BasePhoneInput, BasePhotoInput, UserInfo, Slide},
  data: () => ({
    isPhotoLoading: false,
    isLogoLoading: false,

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

    // Существующий центр
    isExist() {
      return !!this.centerInfo.id
    }
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
      _uploadLogo: "center/uploadLogo",
      _addPhoto: "center/addPhoto",
      _removePhoto: "center/removePhoto",
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

    // Загрузка лого
    async inputLogoHandle(base64Image) {
      if (!base64Image) return;
      if (this.centerInfo.logo && !confirm("Вы точно хотите сменить лого?")) return;
      this.isLogoLoading = true;
      await this._uploadLogo(base64Image);
      this.isLogoLoading = false;
    },

    // Загрузка лого
    async inputPhotoHandle(base64Image) {
      if (!base64Image) return;
      this.isPhotoLoading = true;
      await this._addPhoto(base64Image);
      this.isPhotoLoading = false;
    },

    // Загрузка лого
    async removePhotoHandle(imagePath) {
      if (!imagePath) return;
      await this._removePhoto(imagePath);
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
