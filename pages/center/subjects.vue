<template>
  <div class="subjects page">
    <h2 class="subjects__title">Список Предметов</h2>

    <div class="subjects__tools">
      <v-btn color="primary" outlined @click="createHandle()">Добавить предмет +</v-btn>
    </div>

    <v-data-table
      class="subjects__table elevation-1"
      :headers="tableHeaders"
      :items="subjectList"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon><v-icon>mdi-timetable</v-icon></v-btn>
        <v-btn icon @click="editHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="deleteHandle(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>

    <!-- MODALS -->
    <edit-subject-modal/>
    <remove-subject-modal/>

  </div>
</template>

<script>
import editSubjectModal from "../../components/common/modals/center/editSubjectModal";
import {mapActions, mapGetters} from "vuex";
import removeSubjectModal from "../../components/common/modals/center/removeSubjectModal";
export default {
  name: "subjects",
  components: {removeSubjectModal, editSubjectModal},
  data: () => ({
    tableHeaders: [
      { text: '', value: 'actions', sortable: false, width: 150},
    ],
    subjectList: [],

    isLoading: true,
  }),
  computed: {
    ...mapGetters({
      _subjectList: "center/subjects/getSubjectList",
    })
  },
  watch: {
    _subjectList: {
      handler(val) {
        this.subjectList = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      _fetchList: "center/subjects/fetchSubjectList",
    }),

    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },
    // Создать предмет (кнопка)
    createHandle() {
      this.$modal.show("edit-subject");
    },

    // Редактировать предмет (кнопка)
    editHandle(subject) {
      this.$modal.show("edit-subject", { subject });
    },

    // Удалить предмет (кнопка)
    deleteHandle(subject) {
      this.$modal.show("remove-subject", { subject });
    },
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style lang="scss" scoped>
.subjects {

  &__title {
    margin-bottom: 20px;
  }

  &__table {
    margin-top: 20px;
  }

}
</style>
