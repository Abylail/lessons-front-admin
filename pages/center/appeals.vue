<template>
  <div class="appeals">

    <!-- DESKTOP -->
    <div class="appeals--desktop">
      <v-navigation-drawer :value="true" absolute :permanent="$device.isDesktop" right>

        <!-- Список обращений -->
        <v-list two-line>

          <v-subheader class="appeals__subheader">
            <span>Обращения</span>
            <v-btn color="primary" x-small @click="$modal.show('create-appeal')">Создать +</v-btn>
          </v-subheader>

          <v-progress-linear
            v-show="isLoading"
            indeterminate
            color="primary"
          ></v-progress-linear>

          <v-list-item-group v-model="selectedAppealIndex">
            <template v-for="appeal in appealList">
              <v-list-item class="appeals__appeal" :class="{'appeals__appeal-new': !appeal.center_read}" :key="appeal.id">
                <v-list-item-content>
                  <v-list-item-title>{{ appeal.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ appeal.question }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text>
                    <v-chip class="mr-1" v-if="!appeal.center_read && appeal.answer" color="red" outlined x-small>new</v-chip>
                    {{ getStatusText(appeal.status) }}<v-icon class="ml-1" :color="getStatusColor(appeal.status)" x-small>mdi-circle</v-icon>
                  </v-list-item-action-text>
                  <v-list-item-action-text>{{ appeal.date | dateTimeFormat }}</v-list-item-action-text>
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
          <v-btn color="primary" x-small @click="$modal.show('create-appeal')">Создать +</v-btn>
        </v-subheader>

        <v-progress-linear
          v-show="isLoading"
          indeterminate
          color="primary"
        ></v-progress-linear>

        <v-list-item-group v-model="selectedAppealIndex">
          <template v-for="appeal in appealList">
            <v-list-item class="appeals__appeal" :class="{'appeals__appeal-new': !appeal.center_read}" :key="appeal.id">
              <v-list-item-content>
                <v-list-item-title>{{ appeal.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ appeal.question }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  <v-chip class="mr-1" v-if="!appeal.center_read && appeal.answer" color="red" outlined x-small>new</v-chip>
                  {{ getStatusText(appeal.status) }}<v-icon class="ml-1" :color="getStatusColor(appeal.status)" x-small>mdi-circle</v-icon>
                </v-list-item-action-text>
                <v-list-item-action-text>{{ appeal.date | dateTimeFormat }}</v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
            <v-divider/>
          </template>
        </v-list-item-group>

      </v-list>

    </div>

    <!-- Выбранное письмо -->
    <div class="appeals__view" v-if="selectedAppeal">
      <div class="appeals__view-back"><v-btn icon @click="selectedAppealIndex = null"><v-icon>mdi-arrow-left</v-icon></v-btn></div>
      <div>
        <div class="appeals__view-header">Тема:</div>
        <h3>{{ selectedAppeal.title }}</h3>
        <div class="appeals__view-header">Статус:</div>
        <div>{{ getStatusText(selectedAppeal.status) }}<v-icon class="ml-1" :color="getStatusColor(selectedAppeal.status)" x-small>mdi-circle</v-icon></div>
        <div class="appeals__view-header">Ваш вопрос:</div>
        <div>{{ selectedAppeal.question }}</div>
        <div class="appeals__view-header" v-if="selectedAppeal.answer">Ответ:</div>
        <div>{{ selectedAppeal.answer }}</div>
      </div>
    </div>


    <create-appeal-modal/>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import CreateAppealModal from "@/components/common/modals/center/appeals/createAppealModal";

export default {
  name: "appeals",
  components: {CreateAppealModal},
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
  watch: {
    selectedAppeal(val) {
      // Если выбрали обращение
      if (val) {
        this._readAppeal(val);
      }
    }
  },
  methods: {
    ...mapActions({
      _fetchAppealList: "center/appeals/fetchAppealList",
      _readAppeal: "center/appeals/readAppeal",
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
    &__view-back {display: none}
  }

  &__view {
    padding: 20px 20px 150px;
  }

  &__view-header {
    color: $color--gray;
    line-height: 14px;
    margin-top: 16px;
  }

  &__subheader {
    justify-content: space-between;
  }

  &__appeal {
    background: $color--light-gray;
  }

  &__appeal-new {
    background: white;
  }

}
</style>
