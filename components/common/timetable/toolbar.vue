<template>
  <div class="toolbar">

    <!-- DESKTOP VIEW -->
    <div class="toolbar--desktop">
      <div class="toolbar__top">
        <h2>Фильтр</h2>
      </div>
      <div class="toolbar__bottom relative-columns-4">
        <v-select label="Учителя" outlined dense hide-details/>
        <v-select label="Предметы" outlined dense hide-details/>
        <v-select label="Дни недели" outlined dense hide-details/>
        <v-btn color="primary">Применить</v-btn>
      </div>
    </div>

    <!-- MOBILE VIEW -->
    <div class="toolbar--mobile">

    </div>


  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "toolbar",
  data: () => ({

    // Загрузка учителей
    isTeacherLoading: true,

  }),
  methods: {
    ...mapActions({
      _fetchTeachers: "center/teachers/fetchTeacherList",
      _fetchCenterSubjects: "center/subjects/fetchSubjectCenterList",
    }),

    // Запросить учителей
    async fetchTeachers() {
      this.isTeacherLoading = true;
      await this._fetchTeachers();
      this.isTeacherLoading = false;
    }
  },
  mounted() {
    this.fetchTeachers()
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




  @media (max-width: $break-point) {
    &--desktop {display: none}
  }

  @media (min-width: $break-point) {
    &--mobile {display: none}
  }

}
</style>
