<template>
  <div class="toys page">
    <h2 class="toys__title">Список игрушек</h2>

    <div class="toys__tools">
      <v-btn color="primary" outlined @click="createHandle()">Добавить игрушек +</v-btn>
    </div>

    <v-data-table
      class="toys__table elevation-1"
      :headers="tableHeaders"
      :items="toys"
      item-key="id"
      hide-default-footer
      disable-pagination
    >
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
          {{ item.min_age }} - {{ item.max_age }} лет
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
  }),
  computed: {
    ...mapGetters({
      toys: "admin/toys/getToyList",
    }),
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

}
</style>
