<template>
  <modal name="add-edit-institution" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="add-edit-institution">
      <h2 class="add-edit-institution__title">Создание и редактирование учреждения</h2>

      <div class="add-edit-institution__form">

        <v-text-field
          label="Название на русском"
          v-model="institution.name"
          outlined dense
        />

        <v-textarea
          label="Описание"
          v-model="institution.description"
          outlined dense
        />

        <div class="relative-columns-3">
          <v-text-field
            label="Начало работы"
            v-model="institution.start_time"
            outlined dense
          />
          <v-text-field
            label="Конец работы"
            v-model="institution.end_time"
            outlined dense
          />
        </div>

        <v-text-field
          v-if="institution.director"
          label="Директор"
          :value="`${institution.director.last_name} ${institution.director.first_name} (${institution.director.phone})`"
          append-outer-icon="mdi-delete"
          @click:append-outer="clearDirector()"
          outlined dense readonly
        />

        <div v-else>
        <base-phone-input
          label="Директор"
          placeholder="Введите номер"
          outlined dense
          @input="searchDirector($event)"
        />
        <v-btn
          class="mb-8"
          v-for="directorOption in directorOptions" :key="directorOption.id"
          outlined color="primary"
          @click="setDirector(directorOption)"
        >Выбрать: {{ directorOption.last_name }} {{ directorOption.first_name }} ({{ directorOption.phone }})</v-btn>
        </div>
        <div class="relative-columns-2">
          <base-phone-input
            label="Контактный номер (для звонков)"
            v-model="institution.call_phone"
            outlined dense
          />
          <base-phone-input
            label="Номер whatsapp"
            v-model="institution.whatsapp_phone"
            outlined dense
          />
        </div>

        <div class="relative-columns-2">
          <v-text-field
            label="Email"
            v-model="institution.email"
            outlined dense
          />
          <v-text-field
            label="Ссылка на инстаграм"
            v-model="institution.instagram_url"
            outlined dense
          />
        </div>
      </div>

      <div class="add-edit-institution__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveHandle()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";
import {removePhoneMask} from "@/helpers/masks";
import BasePhoneInput from "@/components/base/BasePhoneInput";

export default {
  name: "addEditInstitutionModal",
  components: {BasePhoneInput},
  data: () => ({
    institution: {},

    directorOptions: [],

    isLoading: false,
  }),
  computed: {
    // Новый ?
    isNew() {
      return !this.institution.id;
    },
  },
  methods: {
    ...mapActions({
      _updateInstitutions: "admin/institutions/updateInstitutions",
      _createInstitutions: "admin/institutions/createInstitutions",
      _searchDirector: "admin/institutions/searchDirector",
    }),

    removePhoneMask,

    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.institution) {
        this.institution = {...this.$modal.$payload.institution};
      }
    },

    clear() {
      this.institution = {};
    },

    closeSelf() {
      this.$modal.hide("add-edit-institution");
    },

    validate() {
      return true;
    },

    clearDirector() {
      this.institution.director = null;
      this.institution.director_id = null;
    },

    setDirector(director) {
      this.institution.director = director;
      this.institution.director_id = director?.id;
    },

    async searchDirector(searchText) {
      const phone = removePhoneMask(searchText);
      if (phone?.length === 11 && !isNaN(+phone)) this.directorOptions = await this._searchDirector(phone);
      else this.directorOptions = [];
    },

    async saveHandle() {
      this.isLoading = true;
      if (this.validate()) {
        let success = false;
        if (this.isNew) success = await this._createInstitutions(this.institution);
        else success = await this._updateInstitutions(this.institution);
        if (success) this.closeSelf();
      }
      this.isLoading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.add-edit-institution {

  &__title {
    padding-right: 80px;
  }

  &__form {
    margin-top: 20px;
    padding-top: 5px;
    overflow-y: auto;
  }

  &__form-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
  }

}
</style>
