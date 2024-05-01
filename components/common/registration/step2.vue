<template>
  <div class="step-2">

    <v-card>
      <v-card-title>Смс код</v-card-title>
      <v-card-text>
        <v-otp-input
          ref="input"
          v-model="form.sms_code"
          length="4"
          type="number"
        />
      </v-card-text>
    </v-card>

    <v-card class="mt-5">
      <v-card-title>Информация о управляющем</v-card-title>
      <v-card-text>
        <div class="relative-columns-2">
          <v-text-field label="Фамилия" v-model="form.last_name" outlined dense/>
          <v-text-field label="Имя" v-model="form.first_name" outlined dense/>
        </div>
        <v-text-field
          label="Придумайте пароль"
          v-model="form.password"
          outlined dense
        />
      </v-card-text>
    </v-card>

    <v-card class="mt-5">
      <v-card-title>Информация о центре</v-card-title>
      <v-card-text>
        <v-text-field label="Название центра" placeholder="Например: Incode Academy" v-model="form.center_name" outlined dense/>
        <div class="relative-columns-2">
          <v-text-field label="Начало" v-model="form.start_time" placeholder="9:00" outlined dense/>
          <v-text-field label="Конец" v-model="form.end_time" placeholder="18:00" outlined dense/>
        </div>
        <div class="relative-columns-2">
          <base-phone-input label="Телефон для звонков" v-model="form.call_phone" outlined dense/>
          <base-phone-input label="Номер WhatsApp" v-model="form.whatsapp_phone" outlined dense/>
        </div>

        <v-textarea label="Краткое описание" placeholder="Центр по робототехнике ..." v-model="form.description" outlined dense no-resize/>
      </v-card-text>
    </v-card>

    <v-btn
      class="mt-5"
      color="primary"
      :loading="isLoading"
      block
      @click="registrateHandle()"
    >Зарегистрироваться</v-btn>

  </div>
</template>

<script>
import {mapActions} from "vuex";
import BasePhoneInput from "@/components/base/BasePhoneInput";

export default {
  name: "step2",
  components: {BasePhoneInput},
  data: () => ({
    isLoading: false,
    code: null,

    form: {
      first_name: null, last_name: null, password: null, sms_code: null,
      center_name: null, start_time: null, end_time: null, call_phone: null, whatsapp_phone: null, description: null
    },
  }),
  methods: {
    ...mapActions({
      _confirmSmsCode: "registration/sendInfo"
    }),

    async validate() {
      return true;
    },

    async registrateHandle() {
      this.isLoading = true;
      const isSuccess = await this._confirmSmsCode(this.form);
      if (isSuccess) this.$nextTick(() => this.$router.push("/"));
      this.isLoading = false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
  }
}
</script>

<style lang="scss" scoped>
.step-2 {
  padding-bottom: 100px;

}
</style>
