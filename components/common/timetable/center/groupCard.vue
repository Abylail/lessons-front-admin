<template>
  <div class="group-card" @click="$emit('click')">

    <div class="group-card__title" :style="{borderColor: indicatorColor}">
      {{ myTime }}
    </div>

    <!-- Предмет -->
    <div class="group-card__info">
      <v-icon class="mr-1" small>mdi-book-open-blank-variant</v-icon>
      {{ value.center_subject_name || value.subject_name }}
    </div>

    <!-- Учитель -->
    <div class="group-card__info">
      <v-icon class="mr-1" small>mdi-account</v-icon>
      {{ value.teacher_full_name }}
    </div>

    <!-- Адрес -->
    <div class="group-card__info">
      <v-icon class="mr-1" small>mdi-map-marker</v-icon>
      {{ value.branch_address }}
    </div>

    <div class="group-card__color-indicator" :style="{backgroundColor: indicatorColor}"/>

  </div>
</template>

<script>
export default {
  name: "groupCard",
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    weekDayCode: {
      type: String,
      default: null,
    }
  },
  computed: {
    myTime() {
      const day = this.value.days.find(d => d.code === this.weekDayCode);
      return `${day.start} - ${day.end}`;
    },
    indicatorColor() {
      return this.value.subject_color;
    },
  },
}
</script>

<style lang="scss" scoped>
.group-card {
  background: white;
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 8px;
  cursor: pointer;
  box-shadow: 0 4px 8px 0 rgba(34, 60, 80, 0.2);
  transition: .15s;
  &:active {
    box-shadow: 0 4px 8px 0 rgba(34, 60, 80, 0);
  }

  &__title {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 3px solid $color--gray;
  }

  &__info {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
  }
}
</style>
