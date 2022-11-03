<template>
  <div class="page timetable">

    <!-- Настройки поиска -->
    <toolbar class="timetable__toolbar"/>

    <!-- Таблица -->
    <div class="timetable__table">

    </div>

  </div>
</template>

<script>
import Toolbar from "@/components/common/timetable/toolbar";
export default {
  name: "timetable",
  components: {Toolbar}
}
</script>

<style lang="scss" scoped>
.timetable {
  display: grid;
  grid-template-rows: 100px 1fr;
  height: 100%;
  padding: 20px;

  &__toolbar {

  }

  &__table {
    overflow: auto;
  }

}
</style>
