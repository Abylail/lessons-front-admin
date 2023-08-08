<template>
  <modal name="remove-subject" size="small" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="remove-subject">
      <div class="remove-subject__text">Вы уверены что хотите удалить <strong>{{ subject.name }}</strong>?</div>
      <div class="remove-subject__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="red" dark :loading="isLoading" @click="deleteHandle()">Удалить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "removeSubjectModal",
  data: () => ({
    // Информация категории
    subject: {ru: {name: null}, kz: {name: null}},

    isLoading:false,
  }),
  methods: {
    ...mapActions({
      _deleteSubject: "admin/subjects/deleteSubject",
    }),

    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.subject) {
        this.subject = {...this.$modal.$payload.subject};
      }
    },

    // Очистка информации
    clear() {
      this.subject = {ru: {name: null}, kz: {name: null}};
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("remove-subject");
    },

    // Удалить кнопка
    async deleteHandle() {
      this.isLoading = true;
      await this._deleteSubject(this.subject);
      this.closeSelf();
      this.isLoading = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.remove-subject {
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
