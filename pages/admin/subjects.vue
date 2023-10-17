<template>
  <div class="subjects page">
    <h2 class="subjects__title">Список предметов</h2>

    <div class="categories__tools">
      <v-btn color="primary" outlined @click="createHandle()">Добавить предмет +</v-btn>
    </div>

    <!-- Поиск -->
    <h3 class="subjects__search-title">Поиск</h3>
    <div class="subjects__search relative-columns-3">
      <v-text-field
        label="Поиск по слову"
        v-model="searchParams.query"
        outlined dense hide-details clearable
      />
      <v-select
        label="Поиск по категории"
        v-model="searchParams.categoryCode"
        :items="categories"
        item-text="name"
        item-value="code"
        outlined dense hide-details clearable
      />
      <v-btn color="primary" block @click="searchHandle()">Поиск</v-btn>
    </div>

    <div class="subjects__table-wrapper">
      <v-data-table
        class="categories__table elevation-1"
        :headers="tableHeaders"
        :items="subjectList"
        :loading="isLoading"
        item-key="id"
        hide-default-footer
        disable-pagination
      >
        <template v-slot:item.is_sport="{ item }">
          {{ item.is_sport ? "Да" : "Нет" }}
        </template>
        <template v-slot:item.color="{ item }">
          <div class="subjects__table-subject-color" :style="{backgroundColor: item.color}"/>
        </template>
        <template v-slot:item.categories="{ item }">
          <v-chip
            v-for="(category, index) in item.categories" :key="index"
            class="mr-1 mb-1 mt-1" outlined small
          >{{ category.name }}</v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="editHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon @click="deleteHandle(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- MODALS -->
    <edit-subject-modal/>
    <remove-subject-modal/>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import EditSubjectModal from "../../components/common/modals/admin/editSubjectModal";
import RemoveSubjectModal from "../../components/common/modals/admin/removeSubjectModal";

export default {
  name: "subjects",
  components: {RemoveSubjectModal, EditSubjectModal},
  data: () => ({

    // Заголовки таблицы
    tableHeaders: [
      { text: 'Название', value: 'name', sortable: false},
      { text: 'Категории', value: 'categories', sortable: false },
      { text: 'Спорт', value: 'is_sport', sortable: false },
      { text: 'Цвет', value: 'color', sortable: false },
      { text: '', value: 'actions', sortable: false, width: 150},
    ],

    isLoading: false,

    // Параметры поиска
    searchParams: {},
  }),
  computed: {
    ...mapGetters({
      categories: "admin/categories/getCategoryList",
      subjectList: "admin/subjects/getSubjectList",
    })
  },
  methods: {
    ...mapActions({
      fetchCategories: "admin/categories/fetchCategoryList",
      _fetchSubjectList: "admin/subjects/fetchSubjectList",
    }),

    // Создать (кнопка)
    createHandle() {
      this.$modal.show("edit-subject");
    },

    // Редактировать (кнопка)
    editHandle(subject) {
      this.$modal.show("edit-subject", {subject});
    },

    // Удалить (кнопка)
    deleteHandle(subject) {
      this.$modal.show("remove-subject", {subject});
    },

    // Поиск
    async searchHandle() {
      this.isLoading = true;
      await this._fetchSubjectList(this.searchParams);
      this.isLoading = false;
    },
  },
  mounted() {
    this.fetchCategories(true);
    this.searchHandle();
  }
}
</script>

<style lang="scss" scoped>
.subjects {
  padding-bottom: 20px;

  &__title {
    margin-bottom: 20px;
  }

  &__table-wrapper {
    margin-top: 20px;
    max-height: calc(100vh - 350px);
    @media (max-height: $break-point) {
      max-height: none;
    }
  }

  &__search {
    & > * {
      margin: 5px 0;
    }
  }

  &__search-title {
    margin-top: 20px;
  }

  &__table-subject-color {
    height: 20px;
    width: 20px;
    border-radius: 3px;
  }

}
</style>
