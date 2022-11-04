<template>
  <div class="column">
    <div class="column__content">
      <div class="column__label">{{ label }}</div>


    </div>
  </div>
</template>

<script>
export default {
  name: "column",
  props: {
    label: {
      type: String,
    }
  }
}
</script>

<style lang="scss" scoped>
.column {
  display: inline-block;
  width: 270px;
  background: $color--light-gray;
  height: 100%;
  margin: 0 5px;
  &:first-child {margin-left: 0}
  &:last-child {margin-right: 0}

  // Для доскроливания на телефоне
  @media (max-width: $break-point) {scroll-snap-align: center;}

  &__label {
    padding: 8px;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
