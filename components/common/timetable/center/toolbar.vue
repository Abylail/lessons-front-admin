<template>
  <div class="toolbar">

    <!-- DESKTOP VIEW -->
    <div class="toolbar--desktop">
      <div class="toolbar__top">
        <h2>Фильтр</h2>
      </div>
      <div class="toolbar__bottom relative-columns-4">
        <v-select
          label="Учителя" placeholder="Все учителя"
          v-model="filterParams.teacher_id"
          :items="teacherList"
          item-text="full_name" item-value="id"
          multiple outlined dense hide-details persistent-placeholder
        />
        <v-select
          label="Предметы" placeholder="Все предметы"
          v-model="filterParams.center_subject_id"
          :items="centerSubjectList"
          item-text="ru.name" item-value="id"
          multiple outlined dense hide-details persistent-placeholder
        />
        <v-select
          label="Дни недели" placeholder="Все дни недели"
          v-model="filterParams.day_code"
          :items="weekdays"
          item-text="name" item-value="code" height="40"
          multiple outlined dense hide-details persistent-placeholder
        />
        <v-btn color="primary">Применить</v-btn>
      </div>
    </div>

    <!-- MOBILE VIEW -->
    <div class="toolbar--mobile">
      <h2>Расписание</h2>
      <v-btn color="primary" small @click="showMobileFilterBar = !showMobileFilterBar">
        <v-icon>mdi-filter</v-icon>
        Фильтр
      </v-btn>
    </div>

    <!-- Боковой фильтр -->
    <v-navigation-drawer class="toolbar__aside" v-model="showMobileFilterBar" width="300" right fixed app>
      <div class="toolbar__aside pa-3">
        <div class="toolbar__aside-title">
          <h2>Фильтр</h2>
        </div>
        <div class="toolbar__aside-filters">
          <v-select
            class="mb-3" label="Учителя" placeholder="Все учителя"
            v-model="filterParams.teacher_id"
            :items="teacherList"
            item-text="full_name" item-value="id"
            multiple outlined dense hide-details persistent-placeholder
          />
          <v-select
            class="mb-3" label="Предметы" placeholder="Все предметы"
            v-model="filterParams.center_subject_id"
            :items="centerSubjectList"
            item-text="ru.name" item-value="id"
            multiple outlined dense hide-details persistent-placeholder
          />
          <v-select
            class="mb-3" label="Дни недели" placeholder="Все дни недели"
            v-model="filterParams.day_code"
            :items="weekdays"
            item-text="name" item-value="code" height="40"
            multiple outlined dense hide-details persistent-placeholder
          />
        </div>
      </div>
      <template v-slot:append>
        <div class="pa-3">
          <v-btn class="mb-2" color="primary" block>Применить</v-btn>
          <v-btn block outlined>Отменить</v-btn>
        </div>
      </template>
    </v-navigation-drawer>


  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {weekdays} from "@/config/lists";

export default {
  name: "toolbar",
  data: () => ({

    // Дни недели
    weekdays,

    // Загрузка учителей
    isTeacherLoading: true,

    // Загрузка предметов центра
    isCenterSubjectLoading: true,

    // Загрузка филиалов
    isBranchesLoading: true,

    // Параметры фильтра
    filterParams: {},

    // Показать боковое фильтр (мобилка)
    showMobileFilterBar: false,

  }),
  computed: {
    ...mapGetters({
      teacherList: "center/teachers/getTeacherList",
      centerSubjectList: "center/subjects/getCenterSubjectList",
      branchList: "center/branches/getBranchList",
    })
  },
  methods: {
    ...mapActions({
      _fetchTeachers: "center/teachers/fetchTeacherList",
      _fetchCenterSubjects: "center/subjects/fetchSubjectCenterList",
      _fetchBranches: "center/branches/fetchBranchList",
    }),

    // Запросить учителей
    async fetchTeachers() {
      this.isTeacherLoading = true;
      await this._fetchTeachers();
      this.isTeacherLoading = false;
    },

    // Запросить предметы центра
    async fetchCenterSubjects() {
      this.isCenterSubjectLoading = true;
      await this._fetchCenterSubjects();
      this.isCenterSubjectLoading = false;
    },

    // Запросить предметы центра
    async fetchBranches() {
      this.isBranchesLoading = true;
      await this._fetchBranches();
      this.isBranchesLoading = false;
    },
  },
  mounted() {
    this.fetchTeachers();
    this.fetchCenterSubjects();
    this.fetchBranches();
  }
}
</script>

<style lang="scss" scoped>
.toolbar {

  &--desktop {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 10px;
  }

  &--mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__aside {
    height: 100% !important;
  }

  &__aside-title {
    margin-bottom: 10px;
  }


  @media (max-width: $break-point) {
    &--desktop {display: none}
  }

  @media (min-width: $break-point) {
    &--mobile {display: none}
  }

}
</style>
