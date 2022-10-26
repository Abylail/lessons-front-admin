<template>
  <div class="timetable">

    <!-- Настройки поиска -->
    <div class="timetable__search">

    </div>

    <!-- Таблица -->
    <div class="timetable__table">
      
    </div>

  </div>
</template>

<script>
export default {
  name: "timetable"
}
</script>

<style lang="scss" scoped>
.timetable {
  display: grid;
  grid-template-rows: 100px 1fr;
  height: 100%;

  &__table {
    overflow: auto;
  }

}
</style>
