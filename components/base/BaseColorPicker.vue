<template>
  <v-text-field :label="label" :value="value" dense outlined @input="setColor($event)">
    <template v-slot:append>
      <v-menu v-model="showPicker" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <div :style="swatchStyle" v-on="on" />
        </template>
        <v-card>
          <v-card-text class="pa-0">
            <v-color-picker v-model="myColor" flat />
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: "BaseColorPicker",
  props: {
    label: {
      type: String,
      default: "Цвет"
    },
    value: {
      type: String,
    }
  },
  data: () => ({
    showPicker: false,

    // Цвет (объект то vuetify)
    myColor: null,
  }),
  computed: {

    // Стиль квадратика с цветом
    swatchStyle() {
      return {
        backgroundColor: this.value || null,
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        borderRadius: this.menu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out',
        border: "1px solid gray"
      }
    }
  },
  watch: {
    // При изменении цвета передаю его hex в родителя
    myColor(color) {
      this.setColor(color?.hex || null);
    }
  },
  methods: {
    setColor(color) {
      this.$emit("input", color);
    }
  }
}
</script>

<style scoped>

</style>
