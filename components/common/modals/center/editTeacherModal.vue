<template>
  <modal name="edit-teacher" size="small" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-teacher">
      <h2>Учитель</h2>
      <div class="edit-teacher__form">
        <v-text-field label="Имя" v-model="teacher.full_name" outlined dense/>
        <v-text-field label="Телефон" v-model="teacher.phone" v-mask="'+7 (###) ###-##-##'" outlined dense/>
      </div>
      <div class="edit-teacher__actions">
        <v-btn>Отменить</v-btn>
        <v-btn class="ml-3" color="primary" @click="saveTeacher()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: "editTeacherModal",
  data: () => ({

    // Информация учителя
    teacher: {},

    isLoading: false,
  }),
  methods: {
    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.teacher) {
        this.teacher = {...this.$modal.$payload.teacher};
      }
    },

    // Учистка
    clear() {
      this.teacher = {};
    },

    // Сохранить учителя
    async saveTeacher() {

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
