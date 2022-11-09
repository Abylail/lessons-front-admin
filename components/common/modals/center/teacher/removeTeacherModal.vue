<template>
  <modal name="remove-teacher" size="small" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="remove-teacher">
      <div class="remove-teacher__text">Вы уверены что хотите удалить <strong>{{ teacher.full_name }}</strong>?</div>
      <div class="remove-teacher__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="red" dark :loading="isLoading" @click="deleteHandle()">Удалить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "removeTeacherModal",
  data: () => ({
    // Информация учителя
    teacher: {},

    isLoading:false,
  }),
  methods: {
    ...mapActions({
      _deleteTeacher: "center/teachers/deleteTeacher",
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
      this.$modal.hide("remove-teacher");
    },

    // Удалить кнопка
    async deleteHandle() {
      this.isLoading = true;
      await this._deleteTeacher(this.teacher);
      this.closeSelf();
      this.isLoading = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.remove-teacher {
  padding-top: 10px;

  &__text {
    height: 40px;
    padding-right: 60px;
    max-width: 300px;
    margin-bottom: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
