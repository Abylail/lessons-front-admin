<template>
  <modal name="add-edit-institution" size="small" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="add-edit-institution">
      <h2 class="add-edit-institution__title">Создание и редактирование учреждения</h2>

      <div class="add-edit-institution__form">
        <v-text-field
          label="Название на русском"
          v-model="institution.name"
          outlined dense
        />
        <v-text-field
          label="Текстовый адрес"
          v-model="institution.address"
          outlined dense
        />

        <div class="add-edit-institution__form-column">
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

        <v-autocomplete
          v-else
          label="Директор"
          :value="institution.director_id"
          placeholder="Введите номер"
          :items="directorOptions"
          item-value="id"
          item-text="phone"
          outlined dense return-object
          @update:search-input="searchDirector($event)"
          @input="setDirector($event)"
        >
          <template v-slot:selection="{ item }">
            {{ item.last_name }} {{ item.first_name }}
          </template>
          <template v-slot:item="{ item }">
            {{ item.last_name }} {{ item.first_name }} ({{ item.phone }})
          </template>
        </v-autocomplete>
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

export default {
  name: "addEditInstitutionModal",
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
      if (searchText?.length === 11 && !isNaN(+searchText)) this.directorOptions = await this._searchDirector(searchText);
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
  }

  &__form-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
  }

}
</style>
