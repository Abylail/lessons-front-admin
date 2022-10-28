<template>
  <modal name="remove-contact" size="small" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="remove-contact">
      <div class="remove-contact__text">Вы уверены что хотите удалить контакт <strong>{{ contact.ru.name }}</strong>?</div>
      <div class="remove-contact__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="red" dark :loading="isLoading" @click="deleteHandle()">Удалить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "removeContactModal",
  data: () => ({
    // Информация контакта
    contact: {ru: {}},

    isLoading:false,
  }),
  methods: {
    ...mapActions({
      _deleteContact: "center/deleteContact",
      _fetchContactInfo: "center/fetchContactInfo",
    }),

    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.contact) {
        this.contact = {...this.$modal.$payload.contact};
      }
    },

    // Очистка информации
    clear() {
      this.contact = {ru: {}};
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("remove-contact");
    },

    // Удалить кнопка
    async deleteHandle() {
      this.isLoading = true;
      await this._deleteContact(this.contact);
      await this._fetchContactInfo();
      this.closeSelf();
      this.isLoading = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.remove-contact {
  padding-top: 40px;

  &__text {
    max-width: 300px;
    margin-bottom: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
