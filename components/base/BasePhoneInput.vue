<template>
  <v-text-field
    ref="phoneInput"
    :value="selfPhone"
    v-mask="'+7 (###) ###-##-##'"
    v-bind="$attrs"
    @input="inputHandle($event)"
  />
</template>

<script>
import {phonePreparing} from "@/helpers/methods";

export default {
  name: "BasePhoneInput",
  props: {
    value: {
      type: String,
    },
  },
  data: () => ({
    selfPhone: null,
  }),
  watch: {
    value: {
      handler(val) {
        if (phonePreparing(this.selfPhone) !== val) this.selfPhone = val;
      },
      immediate: true
    }
  },
  methods: {
    inputHandle(maskedPhone) {
      this.selfPhone = maskedPhone;
      this.$emit("input", phonePreparing(maskedPhone))
    }
  },
  mounted() {
    this.$refs.phoneInput.$refs.input.setAttribute("inputmode", "tel");
  }
}
</script>

<style scoped>

</style>
