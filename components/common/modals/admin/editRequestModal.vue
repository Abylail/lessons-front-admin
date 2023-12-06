<template>
  <modal name="edit-request" size="small" close-button @onShow="getPayload()">
    <div class="edit-request">
      <h2>Обращение</h2>

      <div class="edit-request__form">
        <v-select
          label="Статус"
          item-text="name"
          item-value="code"
          v-model="request.status"
          :items="requestStatuses"
          outlined
          dense
        />
        <v-textarea
          v-model="request.managerComment"
          label="Коммент"
          hint="Например: перезвонить в какой то день"
          persistent-hint
          outlined
          dense
        />
      </div>

      <div class="edit-request__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveSubject()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {requestStatuses} from "@/config/lists";
import {mapActions} from "vuex";

export default {
  name: "editRequestModal",
  data: () => ({
    request: {},

    requestStatuses,

    isLoading: false,
  }),
  methods: {
    ...mapActions({
      _updateRequest: "admin/requests/updateRequest"
    }),

    // Получить данные
    getPayload() {
      this.request = JSON.parse(JSON.stringify(this.$modal.$payload?.request)) || {};
    },

    closeSelf() {
      this.$modal.hide("edit-request")
    },

    async saveSubject() {
      this.isLoading = true;
      const success = await this._updateRequest(this.request);
      if (success) this.closeSelf()
      this.isLoading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-request {

  &__form {
    margin-top: 20px;
  }

  &__actions {
    margin-top: 8px;
    text-align: right;
  }

}
</style>
