<template>
  <div class="toys page">
    <h2 class="toys__title">Список игрушек</h2>

    <div class="toys__tools">
      <v-btn color="primary" outlined @click="createHandle()">Добавить игрушек +</v-btn>
    </div>

    <v-data-table
      class="toys__table elevation-1"
      :headers="tableHeaders"
      :items="toys"
      :loading="isLoading"
      item-key="id"
      hide-default-footer
      disable-pagination
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="updateHandle(item)"><v-icon>mdi-pencil</v-icon></v-btn>
      </template>
    </v-data-table>

    <edit-toy-modal/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import EditToyModal from "@/components/common/modals/admin/editToyModal";

export default {
  name: "toys",
  components: {EditToyModal},
  data: () => ({
    tableHeaders: [
      { text: 'Фото', value: 'photo', sortable: false},
      { text: 'Название', value: 'name_ru', sortable: false},
      { text: 'Токены', value: 'tokens', sortable: false},
      { text: '', value: 'actions', sortable: false, width: 50},
    ],

    isLoading: true
  }),
  computed: {
    ...mapGetters({
      toys: "admin/toys/getToyList",
    }),
  },
  methods: {
    ...mapActions({
      _fetchToys: "admin/toys/fetchToysList",
    }),

    // Запрос
    async fetchToys() {
      this.isLoading = true;
      await this._fetchToys();
      this.isLoading = false;
    },

    // Добавить
    createHandle() {
      this.$modal.show("edit-toy")
    },

    // Обновить
    updateHandle(toy) {
      this.$modal.show("edit-toy", {toy})
    },

    // удалить
    deleteHandle() {

    }
  },
  mounted() {
    this.fetchToys();
  }
}
</script>

<style lang="scss" scoped>
.toys {

  &__title {
    margin-bottom: 20px;
  }

  &__table {
    margin-top: 20px;
  }

}
</style>
