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
import {mapActions} from "vuex";

export default {
  name: "editTeacherModal",
  data: () => ({
    // Информация учителя
    teacher: {},

    isLoading: false,
  }),
  computed: {
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
      if (this.$modal.$payload && this.$modal.$payload.teacher) {
        this.teacher = {...this.$modal.$payload.teacher};
      }
    },

    // Очистка информации
    clear() {
      this.teacher = {};
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

    // Сохранить учителя
    async saveTeacher() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewTeacher) await this._createTeacher(this.teacher);
        else await this._updateTeacher(this.teacher);
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
