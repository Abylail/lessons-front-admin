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


    <!-- MODALS -->
    <edit-category-modal/>
    <remove-category-modal/>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import EditCategoryModal from "../../components/common/modals/admin/editCategoryModal";
import RemoveCategoryModal from "../../components/common/modals/admin/removeCategoryModal";

export default {
  name: "categories",
  components: {RemoveCategoryModal, EditCategoryModal},
  data: () => ({
    // Заголовки для таблицы
    tableHeaders: [
      { text: 'Название на русском', value: 'ru.name', sortable: false},
      { text: 'Название на казахском', value: 'kz.name', sortable: false},
      { text: '', value: 'actions', sortable: false, width: 150},
    ],

    // Список
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
      this.$modal.show("edit-category");
    },

    // Редактировать категорию (Кнопка)
    editHandle(category) {
      this.$modal.show("edit-category", {category});
    },

    // Удалить категорию
    deleteHandle(category) {
      this.$modal.show("remove-category", {category});
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
