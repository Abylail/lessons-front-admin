<template>
  <modal name="create-appeal" :close-on-out-click="false" close-button @onHide="clear()">
    <div class="create-appeal">
      <div class="create-appeal__title">Создание обращение</div>

      <div class="create-appeal__form">
        <v-text-field
          label="Тема обращения"
          v-model="form.title"
          outlined dense
        />
        <v-textarea
          label="Текст обращения"
          v-model="form.question"
          outlined dense auto-grow
        />
      </div>

      <div class="create-appeal__actions">
        <v-btn outlined small @click="closeSelf()">Отменить</v-btn>
        <v-btn :loading="isLoading" color="primary" small @click="sendHandle()">Отправить</v-btn>
      </div>

    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "createAppealModal",
  data: () => ({
    // Форма отправки
    form: {},

    isLoading: false,
  }),
  methods: {
    ...mapActions({
      _sendAppeal: "center/appeals/sendAppeal",
    }),

    // Закрыть себя
    closeSelf() {
      this.$modal.hide("create-appeal");
    },

    // Очистить
    clear() {
      this.form = {};
    },

    // Отправить (Кнопка)
    async sendHandle() {
      this.isLoading = true;
      await this._sendAppeal(this.form);
      this.closeSelf();
      this.isLoading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.create-appeal {
  padding-top: 10px;

  &__title {
    height: 40px;
    padding-right: 60px;
    max-width: 300px;
    margin-bottom: 20px;
    font-size: 20px;
    line-height: 40px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
