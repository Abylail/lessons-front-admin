<template>
  <div class="appeals page">
    <h2 class="appeals__title">Обращения</h2>

    <v-data-table
      class="categories__table elevation-1"
      :headers="tableHeaders"
      :items="appealList"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
      @click:row="rowClickHandle($event)"
    >
      <template v-slot:item.date="{ item }">
        {{ item.date | dateTimeFormat }}
      </template>
      <template v-slot:item.status="{ item }">
        <div>
          {{ getStatusText(item.status) }}
          <v-icon class="ml-1" :color="getStatusColor(item.status)" x-small>mdi-circle</v-icon>
        </div>
      </template>
    </v-data-table>

    <v-pagination class="mt-2" :length="pagesCount"/>

    <answer-appeal-modal/>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AnswerAppealModal from "@/components/common/modals/admin/answerAppealModal";

export default {
  name: "appeals",
  components: {AnswerAppealModal},
  data: () => ({
    isLoading: false,

    tableHeaders: [
      { text: "Дата", value: "date", sortable: false },
      { text: 'Вопрос', value: 'question', sortable: false},
      { text: 'Статус', value: 'status', sortable: false, width: 150},
    ]
  }),
  computed: {
    ...mapGetters({
      appealList: "admin/appeals/getAppealList",
      pagesCount: "admin/appeals/getPagesCount",
    })
  },
  methods: {
    ...mapActions({
      _fetchAppealList: "admin/appeals/fetchAppealList",
    }),

    // Получить список обращений
    async fetchAppealList() {
      this.isLoading = true;
      await this._fetchAppealList();
      this.isLoading = false;
    },

    // Нажатие на строчку
    rowClickHandle(appeal) {
      this.$modal.show("answer-appeal", { appeal });
    },

    // Получить текст по коду статуса
    getStatusText(status) {
      return {
        "pending": "Ожидает",
        "answered": "Отвечен"
      }[status] || "Неизвесный статус"
    },

    // Получить цвет по коду статуса
    getStatusColor(status) {
      return {
        "pending": "orange",
        "answered": "green"
      }[status] || "grey"
    }
  },
  mounted() {
    this.fetchAppealList();
  }
}
</script>

<style lang="scss" scoped>
.appeals {
  padding-bottom: 20px;

  &__title {
    margin-bottom: 20px;
  }

  &__table {
    margin-top: 20px;
  }

}
</style>
