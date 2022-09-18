<template>
  <div class="settings page">

    <!-- Основные настройки -->
    <div class="page__block">
      <h2 class="page__title">Основные настройки</h2>

      <!-- Название центра -->
      <v-text-field
        label="Название центра"
        v-model="mainInfo.name"
        outlined
      />

      <!-- Описание -->
      <v-textarea
        label="Описание"
        v-model="mainInfo.description"
        outlined
        auto-grow
      />

      <!-- Максимальный и минимальный возраст -->
      <div class="page__double-column">
        <v-text-field
          label="Максимальный возраст"
          v-model="mainInfo.maxAge"
          outlined
          type="number"
        />
        <v-text-field
          label="Минимальный возраст"
          v-model="mainInfo.minAge"
          outlined
          type="number"
        />
      </div>

      <h2 class="page__title">Контакты</h2>

      <!-- Instagram и WhatsApp -->
      <div class="page__double-column">
        <v-text-field
          label="Ссылка на Instagram"
          v-model="mainInfo.instagram"
          outlined
        />
        <v-text-field
          label="Номер для WhatsApp"
          v-model="mainInfo.whatsapp"
          outlined
          v-mask="'+7 (###) ###-##-##'"
        />
      </div>

      <!-- Сотовые номера -->
      <div class="page__double-column">
        <v-text-field
          label="Главный сотовый номер"
          v-model="mainInfo.phone"
          outlined
          v-mask="'+7 (###) ###-##-##'"
        />
        <v-text-field
          label="Главный сотовый номер"
          v-model="mainInfo.phone2"
          outlined
          v-mask="'+7 (###) ###-##-##'"
        />
      </div>

      <h2 class="page__title">Филиалы</h2>

      <!-- Адреса -->
      <div class="settings__address" v-for="(address, index) in mainInfo.addresses" :key="index">
        <div class="settings__address-num">Адрес {{ index+1 }}</div>
        <v-select
          label="Город"
          v-model="address.city"
          :items="activeCities"
          item-text="name"
          item-value="name"
          outlined
        />
        <v-text-field
          label="Адрес"
          v-model="address.address"
          outlined
        />
        <v-btn
          class="settings__address-remove"
          color="red"
          block dark
          @click="removeAddressHandle(index)"><v-icon dark>mdi-delete</v-icon></v-btn>
      </div>

      <!-- Добавить адрес -->
      <v-btn
        class="settings__address-add"
        outlined block
        v-show="canAddAddress"
        @click="addAddressHandle()"
      ><v-icon>mdi-plus</v-icon>Добавить адрес</v-btn>

      <!-- Сохранить и Отмена -->
      <div class="page__double-column settings__actions">
        <v-btn block x-large @click="cancelMainInfoHandle()">Отмена</v-btn>
        <v-btn block x-large color="primary" @click="saveMainInfoHandle()">Сохранить</v-btn>
      </div>
    </div>

    <v-divider/>

    <!-- График работы -->
    <div class="page__block">

      <h2 class="page__title">График работы</h2>

      <work-schedule v-model="workSchedule"/>

      <!-- Сохранить и Отмена -->
      <div class="page__double-column settings__actions">
        <v-btn block x-large>Отмена</v-btn>
        <v-btn block x-large color="primary">Сохранить</v-btn>
      </div>
    </div>

    <v-divider/>

    <!-- ФОТО -->
    <div class="page__block">
      <h2 class="page__title">Фото</h2>
    </div>


  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import { activeCities } from "@/config/lists";
import WorkSchedule from "@/components/common/workSchedule";

export default {
  name: "settings",
  components: {WorkSchedule},
  data: () => ({

    // Основная инфа
    mainInfo: {},

    // График работы
    workSchedule: {},

    isLoading: false,

    activeCities,
  }),
  computed: {
    ...mapGetters({
      _userInfo: "user/getUserInfo",
      _workSchedule: "user/getWorkSchedule"
    }),
    canAddAddress() {
      return !this.mainInfo.addresses
        || !this.mainInfo.addresses.length
        || (this.mainInfo.addresses[this.mainInfo.addresses.length - 1].city && this.mainInfo.addresses[this.mainInfo.addresses.length - 1].address);
    }
  },
  methods: {
    ...mapActions({
      _fetchWorkSchedule: "user/fetchWorkSchedule",
    }),

    async getMainInfo() {
      this.mainInfo = JSON.parse(JSON.stringify(this._userInfo));
    },
    async cancelMainInfoHandle() {
      this.isLoading = true;
      await this.getMainInfo();
      this.isLoading = false;
    },
    async saveMainInfoHandle() {
      console.log(this.mainInfo);
    },

    addAddressHandle() {
      this.mainInfo.addresses.push({ city: "", address: "" });
    },
    removeAddressHandle(index) {
      this.mainInfo.addresses.splice(index, 1);
    },

    async getWorkSchedule() {
      await this._fetchWorkSchedule();
      this.workSchedule = JSON.parse(JSON.stringify(this._workSchedule));
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.getMainInfo();
    await this.getWorkSchedule();
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.settings {

  &__address {
    display: grid;
    grid-template-columns: 1fr 3fr 3fr 1fr;
    grid-column-gap: 20px;

    @media (max-width: $break-point) {
      display: block;
      margin-bottom: 30px;
    }
  }

  &__address-num {
    min-height: 56px;
    padding-top: 15px;
    font-weight: bold;
  }

  &__address-add {
    min-height: 56px;
    margin-bottom: 30px;
  }

  &__address-remove {
    @media (min-width: $break-point) {min-height: 56px}
  }

  &__actions {
    margin-top: 70px;
  }

}
</style>
