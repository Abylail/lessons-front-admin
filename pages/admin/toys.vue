<template>
  <div class="toys page">
    <h2 class="toys__title">Список игрушек ({{ _toys.length }})</h2>

    <div class="toys__tools">
      <v-btn color="primary" outlined @click="createHandle()">Добавить +</v-btn>
      <v-text-field label="Поиск по названию" v-model="searchText" dense outlined hide-details clearable/>
    </div>

    <v-data-table
      class="toys__table elevation-1"
      :headers="tableHeaders"
      :items="toys"
      item-key="id"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.name_ru="{ item }">
        <a v-if="item.kaspiUrl" target="_blank" :href="item.kaspiUrl">{{ item.name_ru }}</a>
        <span v-else>{{ item.name_ru }}</span>
      </template>
      <template v-slot:item.photos="{ item }">
        <base-photo-input
          :value="item.photos"
          :loading="isPhotoLoading"
          size="small"
          multiple
          @upload="inputPhotoHandle($event, item)"
          @remove="removePhotoHandle($event, item)"
        />
      </template>
      <template v-slot:item.age="{ item }">
        <span>
          {{ getAge(item) }}
        </span>
      </template>
      <template v-slot:item.token="{ item }">
        <span>
          {{ getToken(item) }}
        </span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="updateHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
      </template>
    </v-data-table>

    <edit-toy-modal/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import EditToyModal from "@/components/common/modals/admin/editToyModal";
import BasePhotoInput from "@/components/base/BasePhotoInput";

export default {
  name: "toys",
  components: {BasePhotoInput, EditToyModal},
  data: () => ({
    tableHeaders: [
      { text: 'Название', value: 'name_ru', sortable: false},
      { text: 'Фото', value: 'photos', sortable: false},
      { text: 'Цена', value: 'price', sortable: false},
      { text: 'Токены', value: 'token', sortable: false},
      { text: 'Возраст', value: 'age', sortable: false},
      { text: '', value: 'actions', sortable: false, width: 50},
    ],

    isLoading: true,
    isPhotoLoading: false,

    searchText: "",
  }),
  computed: {
    ...mapGetters({
      _toys: "admin/toys/getToyList",
    }),

    // Список игрушек
    toys() {
      if (!this.searchText) return this._toys;
      const lowerSearch = this.searchText?.toLowerCase();
      return this._toys.filter(({name_ru}) => name_ru?.toLowerCase().includes(lowerSearch));
    }
  },
  methods: {
    ...mapActions({
      _fetchToys: "admin/toys/fetchToysList",
      _addPhoto: "admin/toys/addPhoto",
      _removePhoto: "admin/toys/removePhoto",
    }),

    getToken(toy) {
      // время окупаемости
      const okkTime = toy?.price > 12000
        ? toy.life_time/3
        : toy?.price < 5001
          ? 2
          : 3;
      return parseInt((toy.price / okkTime)/120);
    },

    // Получить возраст
    getAge(toy) {
      const minAge = toy.min_age % 12 === 0
        ? `${toy.min_age/12} лет`
        : `${toy.min_age} мес`;
      const maxAge = toy.max_age % 12 === 0
        ? `${toy.max_age/12} лет`
        : `${toy.max_age} мес`;
      return `${minAge} - ${maxAge}`
    },

    // Запрос
    async fetchToys() {
      this.isLoading = true;
      await this._fetchToys();
      this.isLoading = false;
    },

    // Добавить
    createHandle() {
      this.$modal.show("edit-toy")
    },

    // Обновить
    updateHandle(toy) {
      this.$modal.show("edit-toy", {toy})
    },

    async inputPhotoHandle(base64Image, toy) {
      if (!base64Image) return;
      this.isPhotoLoading = true;
      await this._addPhoto({buffer: base64Image, toyId: toy.id});
      this.isPhotoLoading = false;
    },

    async removePhotoHandle(imagePath, toy) {
      if (!imagePath) return;
      this.isPhotoLoading = true;
      await this._removePhoto({imagePath, toyId: toy.id});
      this.isPhotoLoading = false;
    }
  },
  mounted() {
    this.fetchToys();
  }
}
</script>

<style lang="scss" scoped>
.toys {

  &__title {
    margin-bottom: 20px;
  }

  &__table {
    margin-top: 20px;
  }

  &__tools {
    display: flex;
    flex-direction: row;
    column-gap: 8px;
    align-items: center;
  }

}
</style>
