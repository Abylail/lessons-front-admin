<template>
  <div class="group-card" @click="$emit('click')">

    <div class="group-card__title" :style="{borderColor: indicatorColor}">
      <span class="group-card__title-left">{{value.teacher_full_name || ""}}</span>
      <span class="group-card__title-right">{{ myTime }}</span>
    </div>

    <!-- Предмет -->
    <div class="group-card__info">
      <v-icon class="mr-1" small>mdi-book-open-blank-variant</v-icon>
      {{ value.center_subject_name }}
    </div>

    <!-- Адрес -->
    <div class="group-card__info">
      <v-icon class="mr-1" small>mdi-map-marker</v-icon>
      {{ value.branch_address }}
    </div>

    <!-- Дни недели -->
    <div class="group-card__info" v-if="value.days?.length">
      <v-icon class="mr-1" small>mdi-calendar-month</v-icon>
      <v-chip
        v-for="({code, start}) in value.days" :key="code"
        class="mr-1 mb-1" color="primary"
        x-small :outlined="code !== weekDayCode"
      >{{ weekdaysShortDictionary[code] }} {{ start }}</v-chip>
    </div>



    <div class="group-card__color-indicator" :style="{backgroundColor: indicatorColor}"/>

  </div>
</template>

<script>
import { weekdaysShortDictionary } from "@/config/lists";

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
  data: () => ({
    // Название дня по коду
    weekdaysShortDictionary,
  }),
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
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 4px solid $color--gray;
  }

  &__title-left {
    display: inline-block;
    max-width: 75px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 5px;
  }

  &__info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    min-height: 24px;
    line-height: 16px;
    font-size: 12px;
  }
}
</style>
