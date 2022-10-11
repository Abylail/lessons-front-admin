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
export default {
  name: "step2",
  data: () => ({
    isLoading: false,
    code: null,
  }),
  methods: {
    async validate() {
      return true;
    },
    async submitHandle() {
      if (await this.validate()) {
        this.$emit("next");
      }
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
