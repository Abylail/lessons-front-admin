<template>
  <div class="time-table">

    <column
      v-for="weekDay in weekdays" :key="weekDay.code"
      :label="weekDay.name"
    />

  </div>
</template>

<script>
import {weekdays} from "@/config/lists";
import Column from "@/components/common/timetable/column";

export default {
  name: "timeTable",
  components: {Column},
  data: () => ({
    weekdays,
  })
}
</script>

<style lang="scss" scoped>
.time-table {
  user-select: none;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  @media (max-width: $break-point) {
    scroll-snap-type: x mandatory;
  }
}
</style>
