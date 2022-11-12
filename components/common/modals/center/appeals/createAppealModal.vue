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
        <v-btn outlined small>Отменить</v-btn>
        <v-btn :loading="isLoading" color="primary" small>Отправить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: "createAppealModal",
  data: () => ({
    // Форма отправки
    form: {title: null, question: null},

    isLoading: false,
  }),
  methods: {
    // Очистить
    clear() {

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
