<template>
  <div class="subjects page">
    <h2 class="subjects__title">Список Предметов</h2>

    <div class="subjects__tools">
      <v-btn color="primary" outlined @click="createHandle()">Добавить предмет +</v-btn>
    </div>

    <v-data-table
      class="subjects__table elevation-1"
      :headers="tableHeaders"
      :items="subjectCenterList"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
      mobile-breakpoint="0"
    >
      <template v-slot:item.photos="{ item }">
        <base-photo-input
          :value="item.photos"
          size="small"
          multiple
          @upload="inputPhotoHandle($event, item)"
          @remove="removePhotoHandle($event, item)"
        />
      </template>
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
import editSubjectModal from "@/components/common/modals/center/subject/editSubjectModal";
import {mapActions, mapGetters} from "vuex";
import removeSubjectModal from "@/components/common/modals/center/subject/removeSubjectModal";
import BasePhotoInput from "~/components/base/BasePhotoInput";
export default {
  name: "subjects",
  components: {BasePhotoInput, removeSubjectModal, editSubjectModal},
  data: () => ({
    tableHeaders: [
      { text: 'Название предмета', value: 'name', sortable: false },
      { text: 'Фото', value: 'photos', sortable: false },
      { text: '', value: 'actions', sortable: false, width: 150},
    ],
    subjectCenterList: [],

    isLoading: true,
  }),
  computed: {
    ...mapGetters({
      _subjectCenterList: "center/subjects/getCenterSubjectList",
    })
  },
  watch: {
    _subjectCenterList: {
      handler(val) {
        this.subjectCenterList = JSON.parse(JSON.stringify(val));
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      _fetchCenterSubjectList: "center/subjects/fetchSubjectCenterList",
      _fetchSubjectList: "center/subjects/fetchSubjectList",
      _addPhoto: "center/subjects/addPhoto",
      _removePhoto: "center/subjects/removePhoto"
    }),

    async fetchList() {
      this.isLoading = true;
      // Беру список всех предметов
      this._fetchSubjectList();
      //  Беру список предметов центра
      await this._fetchCenterSubjectList();
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

    // Загрузить фото
    async inputPhotoHandle(base64Image, subject) {
      if (!base64Image) return;
      this.isLoading = true;
      await this._addPhoto({buffer: base64Image, subject});
      this.isLoading = false;
    },

    // Загрузить фото
    async removePhotoHandle(imagePath, subject) {
      if (!imagePath) return;
      this.isLoading = true;
      await this._removePhoto({imagePath, subject});
      this.isLoading = false;
    }
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
