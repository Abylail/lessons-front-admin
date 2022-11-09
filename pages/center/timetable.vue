<template>
  <div class="page timetable">

    <!-- Настройки поиска -->
    <toolbar class="timetable__toolbar" :filter-params.sync="filterParams"/>

    <!-- Таблица -->
    <time-table class="timetable__table" :hide-days-code="hideDaysCode" :list="filteredGroupList" @editGroup="editGroupHandle($event)"/>

    <!-- Модалка создания группы -->
    <edit-group-modal/>
    <remove-group-modal/>

    <!-- Модалка создания учителя -->
    <edit-teacher-modal/>

    <!-- Модалка создания филиала -->
    <edit-branch-modal/>

    <!-- Модалка создания предмета -->
    <edit-subject-modal/>

  </div>
</template>

<script>
import Toolbar from "@/components/common/timetable/center/toolbar";
import TimeTable from "@/components/common/timetable/center/timetable";
import EditGroupModal from "@/components/common/modals/center/group/editGroupModal";
import {mapActions, mapGetters} from "vuex";
import RemoveGroupModal from "@/components/common/modals/center/group/removeGroupModal";
import EditTeacherModal from "../../components/common/modals/center/teacher/editTeacherModal";
import EditBranchModal from "../../components/common/modals/center/branch/editBranchModal";
import EditSubjectModal from "../../components/common/modals/center/subject/editSubjectModal";
import { weekdays } from "@/config/lists";

export default {
  name: "timetable",
  components: {EditSubjectModal, EditBranchModal, EditTeacherModal, RemoveGroupModal, EditGroupModal, Toolbar, TimeTable},
  data: () => ({
    // Параметры для фильтра
    filterParams: {},

    isLoading: false
  }),
  computed: {
    ...mapGetters({
      groupList: "center/timetable/getGroupList"
    }),
    // Фильтрованный список
    filteredGroupList() {
      return this.groupList.filter(group => {
        // По предметам
        if (!this.filterBySubject(group)) return false;

        // По Учителю
        if (!this.filterByTeacher(group)) return false;

        return true;
      });
    },

    // Коды дней которые надо скрыть
    hideDaysCode() {
      if (!this.filterParams.days?.length) return [];
      return weekdays
        .filter(({code}) => this.filterParams.days.indexOf(code) < 0)
        .map(({code}) => code);
    }
  },
  methods: {
    ...mapActions({
      _fetchTimetable: "center/timetable/fetchTimetable",
    }),

    // Создать группу (кнопка)
    editGroupHandle({ group, dayCode }) {
      this.$modal.show("edit-group", { group, dayCode });
    },

    async fetchTimetable() {
      this.isLoading = true;
      await this._fetchTimetable();
      this.isLoading = false;
    },

    /** Фильтры */

    // Фильтр по предметам
    filterBySubject(group) {
      if (!this.filterParams.center_subject_id?.length) return true;
      return this.filterParams.center_subject_id.includes(group.center_subject_id);
    },

    // Фильтр по учителям
    filterByTeacher(group) {
      if (!this.filterParams.teacher_id?.length) return true;
      return this.filterParams.teacher_id.includes(group.teacher_id);
    },
  },
  mounted() {
    this.fetchTimetable();
  }
}
</script>

<style lang="scss" scoped>
.timetable {
  display: grid;
  grid-template-rows: 100px 1fr;
  height: 100%;
  padding: 20px;
  padding-bottom: 0;

  @media(max-width: $break-point) {
    grid-template-rows: 50px 1fr;
  }

  &__toolbar {

  }

  &__table {
    overflow: auto;
  }

}
</style>
