<template>
  <div class="registration-page">
    <div class="registration-page__card">
      <h1 class="registration-page__title">Регистрация</h1>
      <h2 class="registration-page__sub-title">{{ steps[step].title }}</h2>
      <step1 v-show="step === 0" @next="step++"/>
      <step2 v-if="step === 1" @next="step++" @prev="step--"/>
    </div>
  </div>
</template>

<script>
import Step1 from "@/components/common/registration/step1";
import Step2 from "@/components/common/registration/step2";

export default {
  name: "index",
  components: {Step2, Step1},
  layout: "empty",
  data: () => ({
    step: 0,
    steps: [
      {title: "Телефон управляющего центром"},
      {title: "Информация и подтверждение телефона"},
    ]
  }),
}
</script>

<style lang="scss" scoped>
.registration-page {
  min-height: 100vh;

  &__card {
    margin: auto;
    padding: 30px;
    width: 90%;
    max-width: 500px;
    max-height: 700px;
  }

  &__title {
    font-size: 24px;
  }

  &__sub-title {
    font-size: 20px;
    margin-bottom: 30px;
  }

}
</style>
