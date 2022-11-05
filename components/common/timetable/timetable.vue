<template>
  <div class="time-table">

    <column
      v-for="weekDay in weekdays" :key="weekDay.code"
      :label="weekDay.name"
      @create="createElement({dayCode: weekDay.code})"
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
  }),
  methods: {
    createElement(event) {
      this.$emit("create", event);
    }
  }
}
</script>

<style lang="scss" scoped>
.time-table {
  user-select: none;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding-bottom: 20px;

  @media (max-width: $break-point) {
    scroll-snap-type: x mandatory;
  }
}
</style>
