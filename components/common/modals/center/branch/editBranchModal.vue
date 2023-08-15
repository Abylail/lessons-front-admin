<template>
  <modal name="edit-branch" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-branch">
      <h2>Филиал</h2>
      <div class="edit-branch__form">
        <v-text-field label="Адрес" v-model="branch.address" outlined dense/>
        <v-textarea label="Описание как пройти" v-model="branch.address_description" no-resize outlined dense/>
        <div class="relative-columns-2">
          <base-phone-input label="Телефон (для звонков)" v-model="branch.call_phone" outlined dense/>
          <base-phone-input label="Телефон (whatsapp)" v-model="branch.whatsapp_phone" outlined dense/>
        </div>
        <div class="relative-columns-2">
          <v-text-field label="Ссылка 2гис" v-model="branch.two_gis_url" outlined dense clearable/>
          <v-text-field label="Ссылка яндекс карты" v-model="branch.yandex_url" outlined dense clearable/>
        </div>
        <div class="relative-columns-2">
          <v-text-field label="Email" v-model="branch.email" outlined dense clearable/>
          <v-text-field label="Ссылка инстаграм" v-model="branch.instagram_url" outlined dense clearable/>
        </div>
        <base-yandex-map title="Укажите расложение филиала" v-model="branch.coordinates"/>
      </div>
      <div class="edit-branch__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveBranch()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BasePhoneInput from "@/components/base/BasePhoneInput";
import BaseYandexMap from "@/components/base/BaseYandexMap";

export default {
  name: "editBranchModal",
  components: {BaseYandexMap, BasePhoneInput},
  data: () => ({
    // Информация филиала
    branch: {},

    // После успешного действия колбэк
    successCallback: null,

    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      branchList: "center/branches/getBranchList",
      cities: "getCities",
    }),
    // Новый ли филиал (создание или апдейт)
    isNewBranch() {
      return !this.branch.id;
    },
  },
  methods: {
    ...mapActions({
      _createBranch: "center/branches/createBranch",
      _updateBranch: "center/branches/updateBranch",
      // fetchCities: "fetchCities",
    }),

    // Получить вложения
    getPayload() {
      // Получить инфо филиала
      if (this.$modal.$payload?.branch) this.branch = JSON.parse(JSON.stringify(this.$modal.$payload.branch));
      // Колбэк после успеха
      if (this.$modal.$payload?.successCallback) this.successCallback = this.$modal.$payload.successCallback;
    },

    // Очистка информации
    clear() {
      this.branch = {};
      this.successCallback = null;
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("edit-branch");
    },

    // Валидация информации филиала
    async validate() {
      return true;
    },

    // Вызов успешного колбэка (Вызывается после закрытия модалки)
    callSuccessCallback() {
      if (this.successCallback) {
        const newBranch = this.branchList.find(b => b.address === this.branch.address && b.city_id === this.branch.city_id) || {};
        const successCallback = this.successCallback;
        setTimeout(() => {
          successCallback(newBranch);
        }, 300)
      }
    },

    // Сохранить филиал
    async saveBranch() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewBranch) await this._createBranch(this.branch);
        else await this._updateBranch(this.branch);
        this.callSuccessCallback();
        this.closeSelf();
      }
      this.isLoading = false;
    }
  },
}
</script>

<style lang="scss" scoped>
.edit-branch {

  &__form {
    margin-top: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
