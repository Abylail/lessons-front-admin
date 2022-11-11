<template>
  <div class="appeals">

    <!-- DESKTOP -->
    <div class="appeals--desktop">
      <v-navigation-drawer :value="true" absolute :permanent="$device.isDesktop" right>

        <!-- Список обращений -->
        <v-list two-line>

          <v-subheader class="appeals__subheader">
            <span>Обращения</span>
            <v-btn color="primary" x-small>Создать +</v-btn>
          </v-subheader>

          <v-list-item-group v-model="selectedAppealIndex">
            <template v-for="appeal in appealList">
              <v-list-item :key="appeal.id">
                <v-list-item-content>
                  <v-list-item-title>{{ appeal.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ appeal.question }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text>{{ getStatusText(appeal.status) }}<v-icon class="ml-1" :color="getStatusColor(appeal.status)" x-small>mdi-circle</v-icon></v-list-item-action-text>
                  <v-list-item-action-text>22.02.2022</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
              <v-divider/>
            </template>
          </v-list-item-group>

        </v-list>
      </v-navigation-drawer>
    </div>

    <!-- MOBILE -->
    <div class="appeals--mobile">

      <!-- Список обращений -->
      <v-list two-line v-if="!selectedAppeal">

        <v-subheader class="appeals__subheader">
          <span>Обращения</span>
          <v-btn color="primary" x-small>Создать +</v-btn>
        </v-subheader>

        <v-list-item-group v-model="selectedAppealIndex">
          <template v-for="appeal in appealList">
            <v-list-item :key="appeal.id">
              <v-list-item-content>
                <v-list-item-title>{{ appeal.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ appeal.question }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>{{ getStatusText(appeal.status) }}<v-icon class="ml-1" :color="getStatusColor(appeal.status)" x-small>mdi-circle</v-icon></v-list-item-action-text>
                <v-list-item-action-text>22.02.2022</v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
            <v-divider/>
          </template>
        </v-list-item-group>

      </v-list>

      <!-- Выбранное письмо -->
      <div class="appeals__view" v-else>
        <div><v-btn icon @click="selectedAppealIndex = null"><v-icon>mdi-arrow-left</v-icon></v-btn></div>
      </div>

    </div>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "appeals",
  data: () => ({

    // Индекс выбранного обращения
    selectedAppealIndex: null,

    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      appealList: "center/appeals/getAppealList",
    }),

    // Выбранное обращение
    selectedAppeal() {
      if (typeof this.selectedAppealIndex !== "number") return null;
      return this.appealList[this.selectedAppealIndex];
    }
  },
  methods: {
    ...mapActions({
      _fetchAppealList: "center/appeals/fetchAppealList",
    }),

    // Запросить список обращений
    async fetchAppealList() {
      this.isLoading = true;
      await this._fetchAppealList();
      this.isLoading = false;
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

  @media(max-width: $break-point) {
    &--desktop {display: none}
  }

  @media(min-width: $break-point) {
    &--mobile {display: none}
  }

  &__view {
    padding: 20px 20px 150px;
  }

  &__subheader {

    justify-content: space-between;
  }

}
</style>
