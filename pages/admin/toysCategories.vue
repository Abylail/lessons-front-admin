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
      disable-pagination
    >
      <template v-slot:item.icon_mdi="{ item }">
        <v-icon>{{ item.icon_mdi }}</v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="updateHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="deleteHandle(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>


    <!-- MODALS -->
    <edit-toy-category-modal/>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import EditToyCategoryModal from "../../components/common/modals/admin/EditToyCategoryModal";

export default {
  name: "toysCategories",
  components: {EditToyCategoryModal},
  data: () => ({
    // Заголовки для таблицы
    tableHeaders: [
      { text: 'Название (рус)', value: 'name_ru', sortable: false},
      { text: 'Название (каз)', value: 'name_kz', sortable: false},
      { text: 'Иконка', value: 'icon_mdi', sortable: false},
      { text: '', value: 'actions', sortable: false, width: 150},
    ],

    // Список
    categoryList: [],

    isLoading: true,
  }),
  computed: {
    ...mapGetters({
      _categoryList: "admin/toysCategories/getCategoryList",
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
      _fetchList: "admin/toysCategories/fetchCategoryList",
      _deleteCategory: "admin/toysCategories/deleteCategory",
    }),

    // Получить список категорий
    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },

    // Создать категорию
    createHandle() {
      this.$modal.show("edit-toy-category");
    },

    updateHandle(category) {
      this.$modal.show("edit-toy-category", {category});
    },

    // Удалить категорию
    async deleteHandle(category) {
      if (confirm("Вы точно хотите удалить категорию?")) {
        this.isLoading = true;
        await this._deleteCategory(category);
        this.isLoading = false;
      }
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
