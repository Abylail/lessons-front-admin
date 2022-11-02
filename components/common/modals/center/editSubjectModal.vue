<template>
  <modal name="edit-subject" size="small" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-subject">
      <h2>Учитель</h2>
      <div class="edit-subject__form">
        <v-text-field label="Имя" v-model="subject.name" outlined dense/>
      </div>
      <div class="edit-subject__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveSubject()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "editSubjectModal",
  data: () => ({
    // Информация учителя
    subject: {},

    isLoading: false,
  }),
  computed: {
    // Новый ли учитель (создане или апдейт)
    isNewSubject() {
      return !this.subject.id;
    },
  },
  methods: {
    ...mapActions({
      _createSubject: "center/subjects/createSubject",
      _updateSubject: "center/subjects/updateSubject",
    }),

    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.subject) {
        this.subject = {...this.$modal.$payload.subject};
      }
    },

    // Очистка информации
    clear() {
      this.subject = {};
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("edit-subject");
    },

    // Валидация информации предмета
    async validate() {
      return true;
    },

    // Сохранить предмет
    async saveSubject() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewSubject) await this._createSubject(this.subject);
        else await this._updateSubject(this.subject);
        this.closeSelf();
      }
      this.isLoading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-subject {

  &__form {
    margin-top: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
