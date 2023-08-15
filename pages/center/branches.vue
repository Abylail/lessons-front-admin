<template>
  <div class="branches page">
    <h2 class="branches__title">Адреса и филиалы</h2>

    <div class="branches__tools">
      <v-btn color="primary" outlined @click="createHandle()">Добавить филиал +</v-btn>
    </div>

    <v-data-table
      class="branches__table elevation-1"
      :headers="tableHeaders"
      :items="branchList"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
    >
      <template v-slot:item.call_phone="{ item }">
        {{ item.call_phone | vmask('+7 (###) ###-##-##') }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon><v-icon>mdi-timetable</v-icon></v-btn>
        <v-btn icon @click="editHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="deleteHandle(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>

    <!-- MODALS -->
    <edit-branch-modal/>
    <remove-branch-modal/>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import EditBranchModal from "../../components/common/modals/center/branch/editBranchModal";
import RemoveBranchModal from "../../components/common/modals/center/branch/removeBranchModal";

export default {
  name: "branches",
  components: {RemoveBranchModal, EditBranchModal},
  data: () => ({
    tableHeaders: [
      { text: 'Адрес', value: 'address', sortable: false},
      { text: 'Телефон', value: 'call_phone', sortable: false},
      { text: '', value: 'actions', sortable: false, width: 150},
    ],

    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      branchList: "center/branches/getBranchList",
    })
  },
  methods: {
    ...mapActions({
      _fetchList: "center/branches/fetchBranchList",
    }),

    // Получить список филиалов
    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },

    // Создать филиал
    createHandle() {
      this.$modal.show("edit-branch");
    },

    // Редактировать филиал
    editHandle(branch) {
      this.$modal.show("edit-branch", {branch});
    },

    // Удалить филиал
    deleteHandle(branch) {
      this.$modal.show("remove-branch", {branch});
    },
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style lang="scss" scoped>
.branches {

  &__title {
    margin-bottom: 20px;
  }

  &__link {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__table {
    margin-top: 20px;
  }

}
</style>
