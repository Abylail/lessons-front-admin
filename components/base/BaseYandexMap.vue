<template>
  <div class="base-yandex-map">
    <h2 class="base-yandex-map__title" v-if="title">{{ title }}</h2>
    <div class="base-yandex-map__map" id="base-yandex-map"/>
  </div>
</template>

<script>
const almatyCenterCoords = [43.23974123877094, 76.90200964930152];
export default {
  name: "BaseYandexMap",
  props: {
    title: {
      type: String,
      default: null
    },
    value: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    map: null,
  }),
  methods: {
    init() {
      // Инициализация карты
      this.map = new ymaps.Map("base-yandex-map", {
        center: this.value || almatyCenterCoords,
        zoom: this.value ? 14 : 12,
        controls: ["zoomControl", "searchControl"],
      });

      // Случаю клик
      this.map.events.add('click', this.mapOnClick);

      if (this.value) {
        let myPlacemark = new ymaps.Placemark(this.value, {balloonContentHeader: "Ваш филиал"});
        this.map.geoObjects.add(myPlacemark);
      }
    },

    // Клик на карте
    mapOnClick(event) {
      let coords = event.get('coords');
      let myPlacemark = new ymaps.Placemark(coords);
      this.map.geoObjects.removeAll();
      this.map.geoObjects.add(myPlacemark);
      this.$emit("input", coords);
    },
  },
  mounted() {
    ymaps.ready(this.init);
  }
}
</script>

<style lang="scss" scoped>
.base-yandex-map {
  margin: 10px 0;

  &__title {
    font-size: 20px;
    margin-bottom: 5px;
  }

  &__map {
    height: 400px;
    width: 100%;
    background-color: gray;
  }
}
</style>
