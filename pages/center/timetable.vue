<template>
  <div class="page timetable">

    <!-- Настройки поиска -->
    <toolbar class="timetable__toolbar"/>

    <!-- Таблица -->
    <time-table class="timetable__table" :list="groupList" @editGroup="editGroupHandle($event)"/>

    <!-- Модалка создания группы -->
    <edit-group-modal/>

  </div>
</template>

<script>
import Toolbar from "@/components/common/timetable/center/toolbar";
import TimeTable from "@/components/common/timetable/timetable";
import EditGroupModal from "@/components/common/modals/center/editGroupModal";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "timetable",
  components: {EditGroupModal, Toolbar, TimeTable},
  data: () => ({
    isLoading: false
  }),
  computed: {
    ...mapGetters({
      groupList: "center/timetable/getGroupList"
    })
  },
  methods: {
    ...mapActions({
      _fetchTimetable: "center/timetable/fetchTimetable",
    }),

    // Создать группу (кнопка)
    editGroupHandle({ group, dayCode }) {
      this.$modal.show("edit-group", { group, dayCode });
    },

    async fetchTimetable() {
      this.isLoading = true;
      await this._fetchTimetable();
      this.isLoading = false;
    },
  },
  mounted() {
    this.fetchTimetable();
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
