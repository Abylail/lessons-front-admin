<template>
  <div class="settings page">

    <v-expansion-panels>

      <!-- Основные настройки -->
      <v-expansion-panel>
        <v-expansion-panel-header>Основные настройки</v-expansion-panel-header>
        <v-expansion-panel-content>
            <!-- Название центра -->
            <v-text-field
              label="Название центра"
              v-model="mainInfo.name"
              outlined
              dense
            />

            <!-- Описание -->
            <v-textarea
              label="Описание"
              v-model="mainInfo.description"
              rows="3"
              outlined
              auto-grow
              dense
            />

            <!-- Максимальный и минимальный возраст -->
            <div class="page__double-column">
              <v-text-field
                label="Максимальный возраст"
                v-model="mainInfo.maxAge"
                type="number"
                outlined
                dense
              />
              <v-text-field
                label="Минимальный возраст"
                v-model="mainInfo.minAge"
                type="number"
                outlined
                dense
              />
            </div>

            <!-- Сохранить и Отмена -->
            <div class="page__double-column">
              <v-btn block>Отмена</v-btn>
              <v-btn block color="primary">Сохранить</v-btn>
            </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Контакты -->
      <v-expansion-panel>
        <v-expansion-panel-header>Контакты</v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Instagram и WhatsApp -->
          <div class="page__double-column">
            <v-text-field
              label="Ссылка на Instagram"
              v-model="mainInfo.instagram"
              outlined
              dense
              clearable
            />
            <v-text-field
              label="Номер для WhatsApp"
              v-model="mainInfo.whatsapp"
              v-mask="'+7 (###) ###-##-##'"
              outlined
              dense
            />
          </div>

          <!-- Сотовые номера -->
          <div class="page__double-column">
            <v-text-field
              label="Главный сотовый номер"
              v-model="mainInfo.phone"
              v-mask="'+7 (###) ###-##-##'"
              outlined
              dense
            />
            <v-text-field
              label="Главный сотовый номер"
              v-model="mainInfo.phone2"
              v-mask="'+7 (###) ###-##-##'"
              outlined
              dense
            />
          </div>

          <!-- Сохранить и Отмена -->
          <div class="page__double-column">
            <v-btn block>Отмена</v-btn>
            <v-btn block color="primary">Сохранить</v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Филиалы -->
      <v-expansion-panel>
        <v-expansion-panel-header>Филиалы</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="settings__address" v-for="(address, index) in mainInfo.addresses" :key="index">
            <div class="settings__address-num">Адрес {{ index+1 }}</div>
            <v-select
              label="Город"
              v-model="address.city"
              :items="activeCities"
              item-text="name"
              item-value="name"
              outlined
              dense
            />
            <v-text-field
              label="Адрес"
              v-model="address.address"
              outlined
              dense
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
          <div class="page__double-column">
            <v-btn block>Отмена</v-btn>
            <v-btn block color="primary">Сохранить</v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

    <!-- График работы -->
      <v-expansion-panel>
        <v-expansion-panel-header>График работы</v-expansion-panel-header>
        <v-expansion-panel-content>

          <work-schedule v-model="workSchedule"/>

          <!-- Сохранить и Отмена -->
          <div class="page__double-column settings__actions">
            <v-btn block x-large>Отмена</v-btn>
            <v-btn block x-large color="primary">Сохранить</v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

    <!-- ФОТО -->
      <v-expansion-panel>
        <v-expansion-panel-header>Фото</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="page__block">

          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>


    <v-expansion-panels class="mt-5">

      <!-- Учителя -->
      <v-expansion-panel>
        <v-expansion-panel-header>Мои учителя</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="settings__list">
            <div class="settings__list-item" v-for="teacher in teachers" :key="teacher.id">
              <div>{{ teacher.name }}</div>
              <div>
                <v-btn icon><v-icon>mdi-timetable</v-icon></v-btn>
                <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
                <v-btn icon><v-icon color="red">mdi-delete</v-icon></v-btn>
              </div>
            </div>
            <div class="settings__list-item settings__list-item-create">Добавить +</div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panels>

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
      _userInfo: "center/getUserInfo",
      _workSchedule: "center/getWorkSchedule",
      teachers: "center/getTeachers",
    }),
    canAddAddress() {
      return !this.mainInfo.addresses
        || !this.mainInfo.addresses.length
        || (this.mainInfo.addresses[this.mainInfo.addresses.length - 1].city && this.mainInfo.addresses[this.mainInfo.addresses.length - 1].address);
    }
  },
  methods: {
    ...mapActions({
      _fetchWorkSchedule: "center/fetchWorkSchedule",
      _fetchTeachers: "center/fetchTeachers",
    }),

    // Получить основную информацию
    async getMainInfo() {
      this.mainInfo = JSON.parse(JSON.stringify(this._userInfo));
    },

    // Отмена основная информация
    async cancelMainInfoHandle() {
      this.isLoading = true;
      await this.getMainInfo();
      this.isLoading = false;
    },

    // Сохранить основную информацию
    async saveMainInfoHandle() {
      console.log(this.mainInfo);
    },

    // Добавить адрес
    addAddressHandle() {
      this.mainInfo.addresses.push({ city: "", address: "" });
    },
    // Удалить адрес
    removeAddressHandle(index) {
      this.mainInfo.addresses.splice(index, 1);
    },

    // Получить график
    async getWorkSchedule() {
      await this._fetchWorkSchedule();
      this.workSchedule = JSON.parse(JSON.stringify(this._workSchedule));
    },

    // Получить список учителей
    async getTeachers() {
      await this._fetchTeachers();
    }
  },
  async mounted() {
    this.isLoading = true;
    await this.getMainInfo();
    await this.getWorkSchedule();
    await this.getTeachers();
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
    min-height: 40px;
    margin-bottom: 30px;
  }

  &__address-remove {
    @media (min-width: $break-point) {min-height: 40px}
  }

  &__actions {
    margin-top: 40px;
  }

  &__list {
    border: 1px solid $color--light-gray;
    width: 100%;
    max-width: 300px;
  }

  &__list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    &:not(:last-child) {
      border-bottom: 1px solid $color--light-gray;
    }
  }

  &__list-item-create {
    display: block;
    text-align: center;
    color: $color--blue;
    cursor: pointer;
  }

}
</style>
