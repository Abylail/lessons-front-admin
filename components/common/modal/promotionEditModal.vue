<template>
  <v-dialog :value="show" max-width="1000" @input="$emit('update:show', $event)">
    <v-card>
      <v-card-title>Редактирование акций <v-spacer/><v-btn icon @click="$emit('update:show', false)"><v-icon>mdi-close</v-icon></v-btn></v-card-title>
      <div class="dialog__main">
        <v-text-field
          label="Заголовок"
          v-model="promotion.title"
          outlined
        />
        <vue-editor
          v-model="promotion.content"
        />
      </div>
      <v-card-actions class="dialog__actions">
        <v-btn large @click="$emit('update:show', false)">Отменить</v-btn>
        <v-btn large color="primary" @click="saveHandle()">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "promotionEditModal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object
    }
  },
  data: () => ({
    promotion: {},
  }),
  watch: {
    show(val) {
      if (val) {
        this.promotion = JSON.parse(JSON.stringify(this.value));
      }
    }
  },
  methods: {
    saveHandle() {
      this.$emit("input", this.promotion);
      this.$emit('update:show', false);
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {

  &__main {
    padding: 16px;
  }

  &__actions {
    justify-content: right;
  }

}
</style>
