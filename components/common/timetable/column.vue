<template>
  <div class="column">
    <div class="column__content">
      <div class="column__label">{{ label }}</div>

      <!-- Список в колонке -->
      <div class="column__list">

      </div>

      <div class="column__create">
        <button class="column__create-button" @click="createHandle()">+ Добавить</button>
      </div>
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
  },
  methods: {
    // Добавить (кнопка)
    createHandle() {
      this.$emit("create")
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
  border-radius: 5px;
  &:first-child {margin-left: 0}
  &:last-child {margin-right: 0}

  // Для доскроливания на телефоне
  @media (max-width: $break-point) {scroll-snap-align: center;}

  &__content {
    height: 100%;
    display: grid;
    grid-template-rows: 40px 1fr 40px;
  }

  &__label {
    padding: 8px;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
  }

  &__list {
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__create {
    padding: 8px;
  }

  &__create-button {
    display: block;
    width: 100%;
    text-align: center;
    transition: .15s;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    &:active {background: rgba(0, 0, 0, .1)}
  }
}
</style>
