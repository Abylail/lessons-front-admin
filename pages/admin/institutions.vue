<template>
  <div class="institutions page">
    <h2 class="institutions__title">Образовательные учреждения</h2>

    <div class="institutions__tools">
      <v-btn color="primary" outlined @click="createInstitutionHandle()">Добавить очреждение +</v-btn>
    </div>

    <div class="institutions__table-wrapper">
      <v-data-table
        class="categories__table elevation-1"
        :headers="tableHeaders"
        :items="institutions"
        :loading="isLoading"
        item-key="id"
        hide-default-footer
      >
        <template v-slot:item.type="{ item }">
          <span v-if="item.type === 'center'">Центр</span>
          <span v-else>Неизвесный тип</span>
        </template>
        <template v-slot:item.director="{ item }">
          <span>{{ item.director?.first_name }} {{ item.director?.last_name }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="editHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn icon @click="deleteHandle(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>
    </div>

    <add-edit-institution-modal/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AddEditInstitutionModal from "@/components/common/modals/admin/addEditInstitutionModal";

export default {
  name: "institutions",
  components: {AddEditInstitutionModal},
  data: () => ({
    isLoading: false,

    tableHeaders: [
      { text: "Название", value: "name", sortable: false },
      { text: "Адрес", value: "address", sortable: false },
      { text: "Директор", value: "director", sortable: false },
      { text: "Тип", value: "type", sortable: false },
      { text: "Код", value: "code", sortable: false },
      { text: "", value: "actions", sortable: false, width: 150 }
    ]
  }),
  computed: {
    ...mapGetters({
      institutions: "admin/institutions/getList",
    })
  },
  methods: {
    ...mapActions({
      _fetchInstitutions: "admin/institutions/fetchInstitutions",
      _deleteInstitutions: "admin/institutions/deleteInstitutions"
    }),

    async fetchInstitutions() {
      this.isLoading = true;
      await this._fetchInstitutions();
      this.isLoading = false;
    },

    createInstitutionHandle() {
      this.$modal.show("add-edit-institution", {institution: {}});
    },

    editHandle(institution) {
      this.$modal.show("add-edit-institution", {institution});
    },

    async deleteHandle(institution) {
      if (confirm("Вы уверены что хотите удалить центр?")) {
        this.isLoading = true;
        await this._deleteInstitutions(institution);
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchInstitutions();
  }
}
</script>

<style lang="scss" scoped>
.institutions {

  &__title {
    margin-bottom: 20px;
  }

  &__search-title {
    margin-top: 20px;
  }

  &__search {
    & > * {
      margin: 5px 0;
    }
  }

  &__table-wrapper {
    margin-top: 20px;
    max-height: calc(100vh - 350px);
    @media (max-height: $break-point) {
      max-height: none;
    }
  }

}
</style>
