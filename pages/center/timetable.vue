<template>
  <div class="page timetable">

    <!-- Настройки поиска -->
    <toolbar class="timetable__toolbar"/>

    <!-- Таблица -->
    <time-table class="timetable__table"/>

  </div>
</template>

<script>
import Toolbar from "@/components/common/timetable/toolbar";
import TimeTable from "@/components/common/timetable/timetable";
export default {
  name: "timetable",
  components: {Toolbar, TimeTable}
}
</script>

<style lang="scss" scoped>
.timetable {
  display: grid;
  grid-template-rows: 100px 1fr;
  height: 100%;
  padding: 20px;

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
