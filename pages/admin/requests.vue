<template>
  <div class="requests page">
    <h2 class="requests__title">Обращения</h2>
    <v-data-table
      class="requests__table elevation-1"
      :headers="tableHeaders"
      :items="requests"
      :loading="isLoading"
      item-key="id"
      :item-class="getColorClass"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.createdAt="{ item }">
        {{ new Date(item.createdAt).toLocaleString() }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-select
          class="my-2"
          :value="getStatus(item.status)"
          :items="requestStatuses"
          item-value="code"
          item-text="name"
          outlined
          dense
          @input="statusChange($event, item.id)"
        />
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="updateHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="deleteHandle(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>

    <edit-request-modal/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {requestStatuses} from "@/config/lists";
import EditRequestModal from "@/components/common/modals/admin/editRequestModal";

export default {
  name: "requests",
  components: {EditRequestModal},
  data: () => ({
    isLoading: true,

    tableHeaders: [
      { text: 'Тема', value: 'reason', sortable: false},
      { text: 'Дата', value: 'createdAt', sortable: false},
      { text: 'Телефон', value: 'authorPhone', sortable: false},
      { text: 'Обращение', value: 'text', sortable: false},
      { text: 'Статус', value: 'status', sortable: false},
      { text: 'Коммент менеджера', value: 'managerComment', sortable: false},
      { text: '', value: 'action', sortable: false},
    ],

    requestStatuses,
  }),
  computed: {
    ...mapGetters({
      requests: "admin/requests/getList",
    }),
  },
  methods: {
    ...mapActions({
      _fetchRequests: "admin/requests/fetchList",
      updateRequest: "admin/requests/updateRequest",
      deleteRequest: "admin/requests/deleteRequest",
    }),

    async fetchRequests() {
      this.isLoading = true;
      await this._fetchRequests();
      this.isLoading = false;
    },

    getColorClass({status}) {
      return `requests__row--${status || "start"}`
    },

    getStatus(status) {
      return status || "start";
    },

    async statusChange(status, requestId) {
      this.isLoading = true;
      await this.updateRequest({status, id: requestId});
      this.isLoading = false;
    },

    updateHandle(item) {
      this.$modal.show("edit-request", {request: item})
    },

    async deleteHandle(item) {
      if (confirm("Вы точно хотите удалить обращение?")) {
        this.isLoading = true;
        await this.deleteRequest(item);
        this.isLoading = false;
      }
    },


  },
  mounted() {
    this.fetchRequests();
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .requests {

    &__table {
      margin-top: 20px;
      max-height: calc(100vh - 350px);
      @media (max-height: $break-point) {
        max-height: none;
      }
    }

    &__row {
      &--start {
        background-color: $color--light-gray;
      }

      &--no_answer {
        background-color: $color--light-red !important;
      }

      &--later {
        background-color: $color--light-yellow !important;
      }

      &--processed {
        background-color: $color--light-green !important;
      }
    }

  }
}
</style>
