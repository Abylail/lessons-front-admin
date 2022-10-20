<template>
  <div class="teachers page">
    <h2 class="teachers__title">Список учителей</h2>

    <div class="teachers__tools">
      <v-btn color="primary" outlined @click="createHandle()">Добавить учителя +</v-btn>
    </div>

    <v-data-table
      class="teachers__table elevation-1"
      :headers="tableHeaders"
      :items="teacherList"
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
    <edit-teacher-modal/>

  </div>
</template>

<script>
import EditTeacherModal from "@/components/common/modals/center/editTeacherModal";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "teachers",
  components: {EditTeacherModal},
  data: () => ({
    tableHeaders: [
      { text: 'Имя', value: 'full_name', sortable: false},
      { text: 'Телефон', value: 'phone', sortable: false},
      { text: '', value: 'actions', sortable: false, width: 150},
    ],
    teacherList: [],

    isLoading: true,
  }),
  computed: {
    ...mapGetters({
      _teacherList: "center/teachers/getTeacherList",
    })
  },
  watch: {
    _teacherList: {
      handler(val) {
        this.teacherList = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      _fetchList: "center/teachers/fetchTeacherList",
    }),

    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },
    // Создать учителя (кнопка)
    createHandle() {
      this.$modal.show("edit-teacher");
    },

    // Редактировать учителя (кнопка)
    editHandle(teacher) {
      console.log("edit:", teacher);
      this.$modal.show("edit-teacher", { teacher });
    },

    // Удалить учителя (кнопка)
    deleteHandle(teacher) {
      console.log("delete:", teacher);
    },
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style lang="scss" scoped>
.teachers {

  &__title {
    margin-bottom: 20px;
  }

  &__table {
    margin-top: 20px;
  }

}
</style>
