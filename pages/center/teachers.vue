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
      mobile-breakpoint="0"
      disable-pagination
    >
      <template  v-slot:item.photo="{ item }">
        <base-photo-input
          :value="item.photo"
          :loading="isPhotoLoading"
          :max-width="200"
          @upload="inputPhotoHandle($event, item)"
        />
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon><v-icon>mdi-timetable</v-icon></v-btn>
        <v-btn icon @click="editHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="deleteHandle(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>

    <!-- MODALS -->
    <edit-teacher-modal/>
    <remove-teacher-modal/>

  </div>
</template>

<script>
import EditTeacherModal from "@/components/common/modals/center/teacher/editTeacherModal";
import {mapActions, mapGetters} from "vuex";
import RemoveTeacherModal from "@/components/common/modals/center/teacher/removeTeacherModal";
import BasePhotoInput from "@/components/base/BasePhotoInput";
export default {
  name: "teachers",
  components: {BasePhotoInput, RemoveTeacherModal, EditTeacherModal},
  data: () => ({
    tableHeaders: [
      { text: 'ФИО', value: 'full_name', sortable: false},
      { text: 'Фото', value: 'photo', sortable: false},
      { text: '', value: 'actions', sortable: false, width: 150},
    ],
    teacherList: [],

    isLoading: true,

    isPhotoLoading: false,
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
      _uploadPhoto: "center/teachers/uploadPhoto"
    }),

    // Загрузка фото
    async inputPhotoHandle(base64Image, teacher) {
      if (!base64Image) return;
      if (teacher.photo && !confirm("Вы точно хотите сменить лого?")) return;
      this.isPhotoLoading = true;
      await this._uploadPhoto({base64: base64Image, teacherId: teacher.id});
      this.isPhotoLoading = false;
    },

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
      this.$modal.show("edit-teacher", { teacher });
    },

    // Удалить учителя (кнопка)
    deleteHandle(teacher) {
      this.$modal.show("remove-teacher", { teacher });
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
