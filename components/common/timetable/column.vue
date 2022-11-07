<template>
  <div class="column">
    <div class="column__content">
      <div class="column__label">{{ label }}</div>

      <!-- Список в колонке -->
      <div class="column__list">
        <group-card
          v-for="group in list" :key="group.id"
          :value="group"
          :week-day-code="weekDayCode"
          @click="editHandle(group)"
        />
      </div>

      <div class="column__create">
        <button class="column__create-button" @click="createHandle()">+ Добавить</button>
      </div>
    </div>
  </div>
</template>

<script>
import GroupCard from "@/components/common/timetable/center/groupCard";
export default {
  name: "column",
  components: {GroupCard},
  props: {
    label: {
      type: String,
    },
    list: {
      type: Array,
      default: () => []
    },
    weekDayCode: {
      type: String,
      default: null
    }
  },
  methods: {
    // Добавить (кнопка)
    createHandle() {
      this.$emit("create")
    },

    editHandle(group) {
      this.$emit("update", group);
    },
  }
}
</script>

<style lang="scss" scoped>
.column {
  display: inline-block;
  width: 230px;
  height: 100%;
  margin: 0 5px;
  &:first-child {margin-left: 0}
  &:last-child {margin-right: 0}

  // Для доскроливания на телефоне
  @media (max-width: $break-point) {scroll-snap-align: center;}

  &__content {
    background: $color--light-gray;
    border-radius: 5px;
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
    padding: 0 8px;
    font-size: 14px;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
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
