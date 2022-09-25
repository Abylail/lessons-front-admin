<template>
  <div class="timetable page">

    <h2 class="page__title">Расписание</h2>

    <div class="timetable__search-wrapper">
      <v-text-field
        label="Имя урока"
        v-model="filter.lessonName"
        class="timetable__search"
        outlined
        hide-details
        dense
        clearable
      />
      <v-btn color="primary"><v-icon>mdi-magnify</v-icon></v-btn>
      <v-btn :outlined="showFilter" @click="showFilter = !showFilter">
        <v-icon v-if="!showFilter">mdi-tune-variant</v-icon>
        <v-icon v-else>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- Фильтры -->
    <slide>
      <div v-show="showFilter">
        <div class="timetable__filters">

          <h3 class="mb-2">Фильтры</h3>

          <!-- Дни недели -->
          <div class="timetable__filters-row">
            <span class="timetable__filters-title">Дни недели:</span>
            <v-chip
              v-for="weekday in weekdays"
              :key="weekday.code"
              class="mr-1 mb-1"
              color="blue"
              :outlined="!weekdayIsActive(weekday)"
              label
              dark
              small
              @click="weekdayToggle(weekday)"
            >{{ weekday.name }}</v-chip>
          </div>

          <!-- Учителя -->
          <div class="timetable__filters-row">
            <span class="timetable__filters-title">Учителя:</span>
            <v-chip
              v-for="teacher in teachers"
              :key="teacher.id"
              class="mr-1 mb-1"
              color="primary"
              :outlined="!teacherIsActive(teacher)"
              label
              dark
              small
              @click="teacherToggle(teacher)"
            >{{ teacher.name }}</v-chip>
          </div>

        </div>
      </div>
    </slide>

  </div>
</template>

<script>
import {weekdays} from "@/config/lists";
import {mapActions, mapGetters} from "vuex";
import Slide from "@/components/transitions/slide";

export default {
  name: "timetable",
  components: {Slide},
  data: () => ({

    // Дни недели
    weekdays,

    // Фильтры
    filter: {
      lessonName: "",
      weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      teachers: [],
    },

    showFilter: false,

    isLoading: false,
  }),
  computed: {
    teachers() {
      return [{id: 1, name: "Феликс"}, {id: 2, name: "Марат"}, {id: 3, name: "Всеволод"}]
    }
  },
  methods: {

    // Выбран ли день недели
    weekdayIsActive({ code }) {
      return this.filter.weekdays.includes(code);
    },
    // Добавить/убрать день недели
    weekdayToggle({ code }) {
      if (!this.filter.weekdays.includes(code)) this.filter.weekdays.push(code);
      else {
        const indexToRemove = this.filter.weekdays.indexOf(code);
        this.filter.weekdays.splice(indexToRemove, 1);
      }
    },

    // Выбран ли учитель
    teacherIsActive({ id }) {
      return this.filter.teachers.includes(id);
    },
    // Добавить/убрать учителя
    teacherToggle({ id }) {
      if (!this.filter.teachers.includes(id)) this.filter.teachers.push(id);
      else {
        const indexToRemove = this.filter.teachers.indexOf(id);
        this.filter.teachers.splice(indexToRemove, 1);
      }
    }
  },
  async mounted() {
    this.isLoading = true;

    // Выбираю всех учителей
    this.filter.teachers = this.teachers.map(t => t.id);
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.timetable {

  &__search-wrapper {
    display: grid;
    grid-template-columns: 1fr 64px 64px;
    grid-column-gap: 10px;
    margin-bottom: 10px;
    width: 100%;
    & > * {height: 40px !important}
  }

  &__search {

  }

  &__filters {
    padding: 10px;
    border-top: 2px solid $color--light-gray;
    border-bottom: 2px solid $color--light-gray;
  }

  &__filters-title {
    margin-right: 10px;
  }

  &__filters-row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5px;
  }

}
</style>
