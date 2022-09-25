<template>
  <div class="registration-page">

    <v-card class="registration-page__card">
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step
            v-for="({ title }, index) in steps" :key="index"
            :complete="step > (index + 1)"
            :step="(index + 1)">{{ title }}</v-stepper-step>
        </v-stepper-header>
      </v-stepper>
    </v-card>


<!--    <v-card class="registration-page__card">-->
<!--      <v-card-title>Регистрация</v-card-title>-->
<!--      <div class="registration-page__main">-->

<!--        &lt;!&ndash; USERNAME &ndash;&gt;-->
<!--        <v-text-field-->
<!--          label="Логин"-->
<!--          v-model="registrationInfo.username"-->
<!--          outlined-->
<!--        />-->

<!--      </div>-->
<!--    </v-card>-->

  </div>
</template>

<script>
export default {
  name: "index",
  layout: "empty",
  data: () => ({
    step: 1,
    registrationInfo: {},
    steps: [
      {title: "Основная информация"},
      {title: "Подтверждение телефона"},
      {title: "Создание пароля"},
    ]
  })
}
</script>

<style lang="scss" scoped>
.registration-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;

  &__card {
    margin: auto;
    padding: 20px;
    width: 90%;
    max-width: 1000px;
  }

}
</style>
