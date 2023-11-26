<template>
  <div class="registrations page">
    <h2 class="branches__title">Записи на пробный</h2>
    <v-data-table
      class="registrations__table elevation-1"
      :headers="tableHeaders"
      :items="registrations"
      :loading="isLoading"
      item-key="id"
      :item-class="getColorClass"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.parent_phone="{ item }">
        {{ item.parent_phone | vmask('+7 (###) ###-##-##') }}
      </template>
      <template v-slot:item.child="{ item }">
        <span v-if="item.child_name">{{ item.child_name }} ({{ item.child_age }}лет)</span>
      </template>
      <template v-slot:item.group="{ item }">
        <strong>{{ item.institution?.name }}</strong> <br/>
        {{ item.institutionGroup?.institutionSubject?.name }}
      </template>
      <template v-slot:item.time="{ item }">
        <span v-if="item.date">{{ getWeekday(item.weekday) }} {{ item.time }} <br/> {{ getDate(item.date) }}</span>
      </template>
      <template v-slot:item.contact="{ item }">
        {{ item.institutionGroup?.institutionBranch?.call_phone }}
      </template>
      <template v-slot:item.director="{ item }">
        {{ item.institution?.director?.last_name }} {{ item.institution?.director?.first_name }}<br/>{{ item.institution?.director?.phone }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-select
          class="my-2"
          :value="item.status"
          :items="trialStatuses"
          item-value="code"
          item-text="name"
          outlined
          dense
          @input="statusChange($event, item.id)"
        />
      </template>
      <template v-slot:item.delete="{ item }">
        <v-btn icon @click="editRegistration(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        <v-btn icon @click="deleteRegistration(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>

    <edit-registration-modal/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {weekdaysDictionary} from "@/config/lists";
import {trialStatuses} from "@/config/lists";
import EditRegistrationModal from "@/components/common/modals/admin/editRegistrationModal";

export default {
  name: "registrations",
  components: {EditRegistrationModal},
  data: () => ({
    isLoading: false,

    trialStatuses,

    tableHeaders: [
      { text: 'Тип', value: 'title', sortable: false},
      { text: 'Номер родителя', value: 'parent_phone', sortable: false},
      { text: 'Ребенок', value: 'child', sortable: false},
      { text: 'Группа', value: 'group', sortable: false},
      { text: 'Дата записи', value: 'time'},
      { text: 'Контакт филиала', value: 'contact', sortable: false},
      { text: 'Директор', value: 'director', sortable: false},
      { text: 'Статус', value: 'status', sortable: false},
      { text: '', value: 'delete', sortable: false }
    ],
  }),
  computed: {
    ...mapGetters({
      registrations: "admin/trialRegistrations/getRegistrations",
    }),
  },
  methods: {
    ...mapActions({
      _fetchRegistrations: "admin/trialRegistrations/fetchRegistrations",
      _setStatus: "admin/trialRegistrations/setRegistrationStatus",
      _deleteRegistration: "admin/trialRegistrations/deleteRegistration",
    }),

    // Получить перевод дня недели
    getWeekday(weekdayCode) {
      return weekdaysDictionary[weekdayCode] || "";
    },

    // Получить перевод дня недели
    getDate(date) {
      return new Date(date).toLocaleDateString()
    },

    // Запросить список регситраций
    async fetchRegistrations() {
      this.isLoading = true;
      await this._fetchRegistrations();
      this.isLoading = false;
    },

    // Сменить статус пробного
    statusChange(status, id) {
      this._setStatus({status, id});
    },

    getColorClass({status}) {
      return `registrations__row--${status || "start"}`
    },

    // Удалить запись
    async editRegistration(registration) {
      this.$modal.show("edit-registration", {registration})
    },

    // Удалить запись
    async deleteRegistration(regId) {
      if (!confirm("Вы точно хотите удалить запись?")) return;
      this.isLoading = true;
      await this._deleteRegistration(regId);
      await this._fetchRegistrations();
      this.isLoading = false;
    },
  },
  mounted() {
    this.fetchRegistrations();
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .registrations {

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

      &--confirmed {
        background-color: white;
      }

      &--rejected {
        background-color: $color--light-red !important;
      }

      &--enrolled {
        background-color: $color--light-green !important;
      }
    }

  }
}
</style>
