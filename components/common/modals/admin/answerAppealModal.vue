<template>
  <modal name="answer-appeal" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="answer-appeal">
      <h2 class="answer-appeal__title">Ответ на обращение</h2>

      <div class="answer-appeal__main">

        <div class="answer-appeal__sub-title">Дата обращения:</div>
        <div>{{ appealInfo.date | dateTimeFormat }}</div>

        <div class="answer-appeal__sub-title">Вопрос:</div>
        <div>{{ appealInfo.question }}</div>

        <!-- Поле для ответа -->
        <v-textarea
          v-if="!hasAnswer"
          class="mt-4"
          label="Ответ на обращение"
          v-model="appealInfo.answer"
          auto-grow dense outlined
        />

        <template v-else>
          <div class="answer-appeal__sub-title">Ответ:</div>
          <div>{{ appealInfo.question }}</div>
        </template>

      </div>

      <div class="answer-appeal__actions" v-if="!hasAnswer">
        <v-btn outlined @click="closeSelf()">Отменить</v-btn>
        <v-btn color="primary" :loading="isLoading" @click="sendHandle()">Отправить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "answerAppealModal",
  data: () => ({
    // Информация об обращении
    appealInfo: {},

    // Уже отвечен
    hasAnswer: false,

    isLoading: false,
  }),
  methods: {
    ...mapActions({
      _sendAnswer: "admin/appeals/answerAppeal",
    }),

    // Получить вложения
    getPayload() {
      if (this.$modal.$payload?.appeal) {
        this.hasAnswer = !!this.$modal.$payload.appeal.answer;
        this.appealInfo = JSON.parse(JSON.stringify(this.$modal.$payload.appeal));
      }
    },

    // Очистить
    clear() {
      this.appealInfo = {};
      this.hasAnswer = false;
      this.isLoading = false;
    },

    // Закрыть себя
    closeSelf() {
      this.$modal.hide("answer-appeal");
    },

    // Отправить обращение
    async sendHandle() {
      if (this.appealInfo.answer) {
        this.isLoading = true;
        await this._sendAnswer(this.appealInfo);
        this.isLoading = false;
        this.closeSelf();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.answer-appeal {
  padding-top: 10px;

  &__title {
    height: 40px;
    padding-right: 60px;
    max-width: 300px;
    margin-bottom: 20px;
  }

  &__sub-title {
    margin-top: 10px;
    color: $color--gray;
  }

  &__actions {
    text-align: right;
  }

}
</style>
