<template>
  <div class="registrations page">
    <h2 class="branches__title">Мои записи</h2>
    <v-data-table
      class="branches__table elevation-1"
      :headers="tableHeaders"
      :items="registrations"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.parent_phone="{ item }">
        {{ item.parent_phone | vmask('+7 (###) ###-##-##') }}
      </template>
      <template v-slot:item.child="{ item }">
        {{ item.child_name }} ({{ item.child_age }}лет)
      </template>
      <template v-slot:item.lesson="{ item }">
        {{ item.institutionGroup?.institutionSubject?.name }}
      </template>
      <template v-slot:item.time="{ item }">
        {{ getWeekday(item.weekday) }} {{ item.time }} <br/> {{ getDate(item.date) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {weekdaysDictionary} from "@/config/lists";

export default {
  name: "registrations",
  data: () => ({
    isLoading: false,

    tableHeaders: [
      { text: 'Номер родитель', value: 'parent_phone', sortable: false},
      { text: 'Ребенок', value: 'child', sortable: false},
      { text: 'Урок', value: 'lesson', sortable: false},
      { text: 'Дата записи', value: 'time', sortable: false},
    ],
  }),
  computed: {
    ...mapGetters({
      registrations: "center/registrations/getRegistrations",
    }),
  },
  methods: {
    ...mapActions({
      _fetchRegistrations: "center/registrations/fetchRegistrations",
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
  },
  mounted() {
    this.fetchRegistrations();
  }
}
</script>

<style scoped>

</style>
