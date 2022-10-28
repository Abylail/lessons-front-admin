<template>
  <div class="settings page">

    <!-- Информация пользователя -->
    <user-info/>

    <v-divider class="mt-3 mb-3"/>

    <!-- Информация центра -->
    <div class="settings__center">
      <h2 class="settings__title">Информация центра</h2>
      <div class="relative-columns-2">
        <div>
          <h2 class="settings__sub-title">Информация на русском</h2>
          <v-text-field label="Название центра (Рус)" v-model="centerInfo.ru.name" outlined dense/>
          <v-textarea label="Описание центра (Рус)" v-model="centerInfo.ru.description" outlined dense/>
        </div>
        <div>
          <h2 class="settings__sub-title">Информация на казахском</h2>
          <v-text-field label="Название центра (Каз)" v-model="centerInfo.kz.name" outlined dense/>
          <v-textarea label="Описание центра (Каз)" v-model="centerInfo.kz.description" outlined dense/>
        </div>
      </div>
      <v-text-field label="Ссылка на инстаграм" v-model="centerInfo.instagram" outlined dense/>
      <v-btn
        color="primary"
        :loading="centerInfoLoading"
        block
        @click="saveCenterInfo()"
      >Сохранить информацию центра</v-btn>
    </div>

    <v-divider class="mt-3 mb-3"/>

    <!-- Контактная информация -->
    <div class="settings__center">
      <h2 class="settings__title">Контактная информация</h2>
      <v-card class="settings__contact-card" v-for="(contact, index) in contactInfo" :key="index">
        <div class="settings__contact-card-head">
          <h3 class="mb-2">Контакт {{ index+1 }}</h3>
          <v-btn title="Удалить контакт" icon @click="deleteContact(contact)"><v-icon color="red" small>mdi-delete</v-icon></v-btn>
        </div>

        <div class="relative-columns-2">
          <v-text-field
            label="Название на русском"
            v-model="contact.ru.name"
            hint="Пример: Номер менеджера"
            persistent-hint outlined dense
          />
          <v-text-field
            label="Название на казахском"
            v-model="contact.kz.name"
            hint="Пример: Номер менеджера"
            persistent-hint outlined dense
          />
        </div>

        <div class="relative-columns-2">
          <v-text-field
            label="Номер"
            v-model="contact.phone"
            v-mask="'+7 (###) ###-##-##'"
            type="tel"
            outlined dense hide-details
          />
          <v-switch
            class="mt-1"
            v-model="contact.can_call"
            label="Можно звонить"
            hide-details
          />
        </div>

        <div class="relative-columns-2">
          <v-switch
            class="mt-1"
            v-model="contact.whatsapp"
            label="Это номер Whatsapp"
            color="green"
            hide-details
          />
        </div>

        <slide>
        <div class="relative-columns-2 mt-2" v-if="contact.whatsapp">
          <v-text-field
            label="Сообщение при переходе на whatsapp (русское)"
            v-model="contact.ru.whatsapp_message"
            hint="Здавствуйте пишу по поводу..."
            persistent-hint outlined dense
          />
          <v-text-field
            label="Сообщение при переходе на whatsapp (казахское)"
            v-model="contact.kz.whatsapp_message"
            hint="Здавствуйте пишу по поводу..."
            persistent-hint outlined dense
          />
        </div>
        </slide>
      </v-card>
      <div class="relative-columns-2">
      <v-btn
        class="mt-5"
        color="primary"
        block outlined
        @click="addContact()"
      >+ добавить контакт</v-btn>
      <v-btn
        class="mt-5"
        color="primary"
        :loading="contactInfoLoading"
        block
        @click="saveContactInfo()"
      >Сохранить контакты центра</v-btn>
      </div>
    </div>

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
    centerInfo: { kz: {name: null, description: null}, ru: {} }, // { instagram, ru: { name, description } }
    centerInfoLoading: false,

    // Контакты
    contactInfo: [{"phone": "", "whatsapp": true, "center_id": 1, "ru": {"name": "манагер"}, "kz": {"name": "манагер"}}],
    contactInfoLoading: false,
  }),
  computed: {
    ...mapGetters({
      _centerInfo: "center/getCenterInfo",
      _contactInfo: "center/getContactInfo",
    })
  },
  watch: {
    _centerInfo: {
      handler(val) {
        if (!val) return;
        this.centerInfo = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    },
    _contactInfo: {
      handler(val) {
        if (!val) return;
        this.contactInfo = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      _saveCenterInfo: "center/saveCenterInfo",
      _fetchCenterInfo: "center/fetchCenterInfo",
      _fetchContactInfo: "center/fetchContactInfo",
      _saveContactInfo: "center/saveContactInfo",
      _deleteContact: "center/deleteContact",
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

    // Добавить контакт
    addContact() {
      this.contactInfo.push({
        "phone": null,
        "whatsapp": false,
        "can_call": false,
        "ru": {"name": null}, "kz": {"name": null}
      })
    },

    // Сохранить контакты
    async saveContactInfo() {
      this.contactInfoLoading = true;
      await this._saveContactInfo(this.contactInfo);
      await this._fetchContactInfo();
      this.contactInfoLoading = false;
    },

    // Получить контакты
    async fetchContactInfo() {
      this.contactInfoLoading = true;
      await this._fetchContactInfo();
      this.contactInfoLoading = false;
    },

    async deleteContact(contact) {
      this.contactInfoLoading = true;
      await this._deleteContact(contact);
      await this._fetchContactInfo();
      this.contactInfoLoading = false;
    },

  },
  mounted() {
    this.fetchCenterInfo();
    this.fetchContactInfo();
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
