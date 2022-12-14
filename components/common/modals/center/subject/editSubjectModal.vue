<template>
  <modal name="edit-subject" size="small" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-subject">
      <h2>Предмет</h2>
      <div class="edit-subject__form">
        <v-autocomplete label="Предмет" v-model="subject.subject_id" item-value="id" item-text="ru.name" :items="subjectList" outlined dense :disabled="!isNewSubject" @change="subjectChanged($event)"/>
        <v-text-field label="Имя предмета на русском" v-model="subject.ru.name" maxlength="50" counter outlined dense/>
        <v-text-field label="Имя предмета на казахском" v-model="subject.kz.name" maxlength="50" counter outlined dense/>
      </div>
      <div class="edit-subject__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveSubject()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "editSubjectModal",
  data: () => ({
    // Информация учителя
    subject: {ru: {}, kz: {}},

    // После успешного действия колбэк
    successCallback: null,

    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      subjectList: "center/subjects/getSubjectList",
      centerSubjectList: "center/subjects/getCenterSubjectList",
    }),
    // Новый ли предмет (создание или апдейт)
    isNewSubject() {
      return !this.subject.id;
    },
  },
  methods: {
    ...mapActions({
      _fetchSubjectList: "center/subjects/fetchSubjectList",
      _createSubject: "center/subjects/createSubject",
      _updateSubject: "center/subjects/updateSubject",
    }),

    // Список предметов для выбора
    async fetchSubjectList() {
      this.isLoading = true;
      await this._fetchSubjectList();
      this.isLoading = false;
    },

    // Получить вложения
    async getPayload() {
      await this.fetchSubjectList();
      // Получить инфо предмета центра
      if (this.$modal.$payload?.subject) this.subject = JSON.parse(JSON.stringify(this.$modal.$payload.subject));
      // Колбэк после успеха
      if (this.$modal.$payload?.successCallback) this.successCallback = this.$modal.$payload.successCallback;
    },

    // Очистка информации
    clear() {
      this.subject = {ru: {}, kz: {}};
      this.successCallback = null;
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("edit-subject");
    },

    // Изменение предмет
    subjectChanged(subjectId) {
      if (!subjectId) {
        // Выбор предмета убран
        this.subject.ru.name = null;
        this.subject.kz.name = null;
      }
      else {
        // Предмет выбран
        const selectedSubject = this.subjectList.find(s => +s.id === +subjectId);
        this.subject.ru.name = selectedSubject.ru.name;
        this.subject.kz.name = selectedSubject.kz.name;
      }
    },

    // Валидация информации предмета
    async validate() {
      if (!this.subject.ru.name) {
        this.$toast.error("Введите название предмета на русском");
        return false;
      }
      if (!this.subject.kz.name) {
        this.$toast.error("Введите название предмета на казахском");
        return false;
      }
      if (!this.subject.subject_id) {
        this.$toast.error("Выберите предмет");
        return false;
      }
      return true;
    },

    // Вызов успешного колбэка (Вызывается после закрытия модалки)
    callSuccessCallback() {
      if (this.successCallback) {
        const newCenterSubject = this.centerSubjectList.find(s => s.ru.name === this.subject.ru.name && s.kz.name === this.subject.kz.name && s.subject_id === this.subject.subject_id) || {};
        const successCallback = this.successCallback;
        setTimeout(() => {
          successCallback(newCenterSubject);
        }, 300)
      }
    },

    // Сохранить предмет
    async saveSubject() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewSubject) await this._createSubject(this.subject);
        else await this._updateSubject(this.subject);
        this.callSuccessCallback();
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
