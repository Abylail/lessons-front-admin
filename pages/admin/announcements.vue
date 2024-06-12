<template>
  <div class="announcements page">
    <h2 class="announcements__title">Объявления</h2>

    <v-tabs v-model="tabIndex">
      <v-tab v-for="tab in tabs" :key="tab.code" :tab-value="tab.code">{{ tab.name }}</v-tab>
    </v-tabs>

    <v-data-table
      class="announcements__table elevation-1 mt-5"
      :headers="tableHeaders"
      :items="list"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.updatedAt="{ item }">
        {{ item.updatedAt | dateTimeFormat }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="updateHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
      </template>
    </v-data-table>

    <edit-announcement/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import EditAnnouncement from "@/components/common/modals/admin/editAnnouncement";

export default {
  name: "announcements",
  components: {EditAnnouncement},
  data: () => ({
    tabIndex: 0,
    tabs: [
      {name: "Модерация", code: "moderation"},
      {name: "Оплата", code: "waitingPayment"},
      {name: "Доставка", code: "ordered"},
    ],

    tableHeaders: [
      { text: "Название", value: "title", sortable: false },
      { text: 'Цена', value: 'price', sortable: false},
      { text: 'Телефон', value: 'seller.phone', sortable: false},
      { text: 'Обновлен', value: 'updatedAt', sortable: false,},
      { text: '', value: 'actions', sortable: false,},
    ],

    isLoading: true
  }),
  computed: {
    ...mapGetters({
      list: "admin/announcements/getList",
    }),
    activeTab() {
      return this.tabs.find((_, index) => index === this.tabIndex) || {};
    }
  },
  methods: {
    ...mapActions({
      _fetchAnnouncements: "admin/announcements/fetchAppealList",
    }),

    updateHandle(announcement) {
      this.$modal.show("edit-announcement", {announcement});
    },
  },
  watch: {
    activeTab: {
      async handler(val) {
        this.isLoading = true;
        await this._fetchAnnouncements(val?.code);
        this.isLoading = false;
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
.announcements {

}
</style>
