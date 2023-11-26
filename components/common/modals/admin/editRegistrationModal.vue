<template>
  <modal name="edit-registration" size="small" close-button @onShow="getPayload()">
    <div class="edit-registration">
      <h2>Заявка</h2>

      <div class="edit-registration__form">
        <v-text-field
          v-model="registration.title"
          label="Тип"
          hint="Например: пробный урок"
          persistent-hint
          outlined
          dense
        />
        <v-select
          label="День недели пробного"
          item-text="name"
          item-value="code"
          v-model="registration.weekday"
          :items="weekdays"
          outlined
          dense
        />
        <v-text-field
          v-model="registration.time"
          v-mask="'##:##'"
          label="Время пробного"
          hint="Например: 09:00"
          persistent-hint
          outlined
          dense
        />
        <h4>День пробного</h4>
        <v-date-picker
          v-model="date"
          title="День пробного"
          locale="ru"
          full-width
          landscape
        />
      </div>

      <div class="edit-registration__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveSubject()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {weekdays} from "@/config/lists";
import moment from "moment";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "editRegistrationModal",
  data: () => ({
    registration: {},

    weekdays,

    isLoading: false,
  }),
  computed: {
    date: {
      get() {
        if (!this.registration.date) return null
        return moment(this.registration.date).format("YYYY-MM-DD");
      },
      set(date) {
        return this.registration = {...this.registration, date: moment(date).toDate()};
      },
    }
  },
  methods: {
    ...mapActions({
      _updateRegistration: "admin/trialRegistrations/updateRegistration"
    }),

    // Получить данные
    getPayload() {
      this.registration = JSON.parse(JSON.stringify(this.$modal.$payload?.registration)) || {};
    },

    closeSelf() {
      this.$modal.hide("edit-registration")
    },

    async saveSubject() {
      this.isLoading = true;
      const success = await this._updateRegistration(this.registration);
      if (success) this.closeSelf()
      this.isLoading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-registration {

  &__form {
    margin-top: 20px;
  }

  &__actions {
    margin-top: 8px;
    text-align: right;
  }

}
</style>
