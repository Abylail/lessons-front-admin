<template>
  <div class="timetable page">

    <h2 class="page__title">Расписание</h2>

    <!-- Фильтры -->
    <div class="timetable__filters">

      <!-- Дни недели -->
      <div class="timetable__filters-row">
        <v-chip
          v-for="weekday in weekdays"
          :key="weekday.code"
          class="mr-2 mb-2"
          color="blue"
          :outlined="!weekdayIsActive(weekday)"
          label
          dark
          small
          @click="weekdayToggle(weekday)"
        >{{ weekday.name }}</v-chip>
      </div>

    </div>

  </div>
</template>

<script>
import {weekdays} from "@/config/lists";

export default {
  name: "timetable",
  data: () => ({
    weekdays,

    filter: {
      weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    }
  }),
  methods: {
    weekdayIsActive({ code }) {
      return this.filter.weekdays.includes(code);
    },
    weekdayToggle({ code }) {
      if (!this.filter.weekdays.includes(code)) this.filter.weekdays.push(code);
      else {
        const indexToRemove = this.filter.weekdays.indexOf(code);
        this.filter.weekdays.splice(indexToRemove, 1);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.timetable {

  &__filters {

  }

}
</style>
