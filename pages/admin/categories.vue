<template>
  <div class="categories page">
    <h2 class="categories__title">Список категорий</h2>

    <div class="categories__tools">
      <v-btn color="primary" outlined @click="createHandle()">Добавить категорию +</v-btn>
    </div>

    <v-data-table
      class="categories__table elevation-1"
      :headers="tableHeaders"
      :items="categoryList"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="editHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="deleteHandle(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>


  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "categories",
  data: () => ({
    tableHeaders: [
      { text: 'Название на русском', value: 'ru.name', sortable: false},
      { text: 'Название на казахском', value: 'kz.name', sortable: false},
      { text: '', value: 'actions', sortable: false, width: 150},
    ],

    categoryList: [],

    isLoading: true,
  }),
  computed: {
    ...mapGetters({
      _categoryList: "admin/categories/getCategoryList",
    })
  },
  watch: {
    _categoryList: {
      handler(val) {
        this.categoryList = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      _fetchList: "admin/categories/fetchCategoryList",
    }),

    // Получить список категорий
    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },

    // Создать категорию
    createHandle() {

    },

    // Редактировать категорию (Кнопка)
    editHandle() {

    },

    // Удалить категорию
    deleteHandle() {

    },
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style lang="scss" scoped>
.categories {

  &__title {
    margin-bottom: 20px;
  }

  &__table {
    margin-top: 20px;
  }

}
</style>
