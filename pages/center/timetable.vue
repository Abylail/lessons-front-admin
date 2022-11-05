<template>
  <div class="page timetable">

    <!-- Настройки поиска -->
    <toolbar class="timetable__toolbar"/>

    <!-- Таблица -->
    <time-table class="timetable__table" @create="createGroupHandle($event)"/>

    <!-- Модалка создания группы -->
    <edit-group-modal/>

  </div>
</template>

<script>
import Toolbar from "@/components/common/timetable/toolbar";
import TimeTable from "@/components/common/timetable/timetable";
import EditGroupModal from "@/components/common/modals/center/editGroupModal";
export default {
  name: "timetable",
  components: {EditGroupModal, Toolbar, TimeTable},
  methods: {
    // Создать группу (кнопка)
    createGroupHandle({ dayCode }) {
      console.log("dayCode", dayCode);
      this.$modal.show("edit-group", { dayCode });
    }
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
