<template>
  <div class="step-2">

    <v-otp-input
      ref="input"
      v-model="code"
      length="4"
      type="number"
      @finish="submitHandle()"
    ></v-otp-input>

<!--    <v-btn-->
<!--      class="mt-4"-->
<!--      large block-->
<!--      @click="backHandle()"-->
<!--    >Назад</v-btn>-->

  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "step2",
  data: () => ({
    isLoading: false,
    code: null,
  }),
  methods: {
    ...mapActions({
      _confirmSmsCode: "registration/confirmSmsCode"
    }),
    async validate() {
      if (!this.code) {
        return false;
      }
      else if (this.code.length !== 4) {
        return false;
      }
      return await this._confirmSmsCode({code: this.code});
    },
    async submitHandle() {
      this.isLoading = true;
      if (await this.validate()) {
        this.$emit("next");
      }
      else {
        this.code = null;
        this.$refs.input.focus();
      }
      this.isLoading = false;
    },
    backHandle() {
      this.code = null;
      this.$emit("prev");
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
  }
}
</script>

<style scoped>

</style>
