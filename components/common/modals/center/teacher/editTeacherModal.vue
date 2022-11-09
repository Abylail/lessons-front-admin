<template>
  <modal name="edit-teacher" size="small" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-teacher">
      <h2>Учитель</h2>
      <div class="edit-teacher__form">
        <v-text-field label="Имя" v-model="teacher.full_name" outlined dense/>
        <v-text-field label="Телефон" v-model="teacher.phone" v-mask="'+7 (###) ###-##-##'" outlined dense/>
      </div>
      <div class="edit-teacher__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveTeacher()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "editTeacherModal",
  data: () => ({
    // Информация учителя
    teacher: {},

    // После успешного действия колбэк
    successCallback: null,

    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      teacherList: "center/teachers/getTeacherList",
    }),
    // Новый ли учитель (создане или апдейт)
    isNewTeacher() {
      return !this.teacher.id;
    },
  },
  methods: {
    ...mapActions({
      _createTeacher: "center/teachers/createTeacher",
      _updateTeacher: "center/teachers/updateTeacher",
    }),

    // Получить вложения
    getPayload() {
      // Инфа по учителю
      if (this.$modal.$payload?.teacher) this.teacher = {...this.$modal.$payload.teacher};
      // Колбэк после успеха
      if (this.$modal.$payload?.successCallback) this.successCallback = this.$modal.$payload.successCallback;
    },

    // Очистка информации
    clear() {
      this.teacher = {};
      this.successCallback = null;
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("edit-teacher");
    },

    // Валидация информации учителя
    async validate() {
      if (!this.teacher.full_name) {
        return false;
      }
      return true;
    },

    // Вызов успешного колбэка (Вызывается после закрытия модалки)
    callSuccessCallback() {
      if (this.successCallback) {
        const newTeacher = this.teacherList.find(t => t.full_name === this.teacher.full_name && t.phone === this.teacher.phone) || {};
        const successCallback = this.successCallback;
        setTimeout(() => {
          successCallback(newTeacher);
        }, 300)
      }
    },

    // Сохранить учителя
    async saveTeacher() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewTeacher) await this._createTeacher(this.teacher);
        else await this._updateTeacher(this.teacher);
        this.callSuccessCallback();
        this.closeSelf();
      }
      this.isLoading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-teacher {

  &__form {
    margin-top: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
