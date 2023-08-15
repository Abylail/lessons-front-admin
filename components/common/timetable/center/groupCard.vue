<template>
  <div class="group-card" @click="$emit('click')" :style="{borderColor: indicatorLineColor}">

    <div class="group-card__title">
      <span class="group-card__title-indicator" :style="{backgroundColor: indicatorCircleColor}"/>
      <span class="group-card__title-left">{{value.teacher_full_name || ""}}</span>
      <span class="group-card__title-right">{{ myTime }}</span>
    </div>


    <div class="group-card__info-wrapper">

      <!-- Предмет -->
      <div class="group-card__info">
        <v-icon class="mr-1" small>mdi-book-open-blank-variant</v-icon>
        {{ value.institutionSubject?.name }}
      </div>

      <!-- Адрес -->
      <div class="group-card__info">
        <v-icon class="mr-1" small>mdi-map-marker</v-icon>
        {{ value.institutionBranch?.address }}
      </div>

      <!-- Дни недели -->
      <div class="group-card__info" v-if="showDays">
        <v-icon class="mr-1" small>mdi-calendar-month</v-icon>
        <div
          class="group-card__info-day" :class="{highlighted: code === weekDayCode}"
          v-for="({code, start}) in value.days" :key="code"
        >{{ weekdaysShortDictionary[code] }}({{ start }})</div>
      </div>
    </div>

  </div>
</template>

<script>
import { weekdaysShortDictionary, uniqueColors } from "@/config/lists";

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
    // Время от какого до какого
    myTime() {
      return this.value[`${this.weekDayCode}_start`] + " - " + this.value[`${this.weekDayCode}_end`];
    },

    // Цвет круга индикатора
    indicatorCircleColor() {
      return uniqueColors[this.value.id % uniqueColors.length];
    },

    // Цвет линии индикатора
    indicatorLineColor() {
      return this.value.subject_color;
    },

    // Показывать дни недели или нет
    showDays() {
      if (!this.value.days) return false;
      return this.value.days.length > 1;
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
  //border-right: 4px solid transparent;
  border-bottom: 4px solid transparent;
  &:active {
    box-shadow: 0 4px 8px 0 rgba(34, 60, 80, 0);
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
  }

  &__title-left {
    display: inline-block;
    max-width: 75px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 5px;
  }

  &__title-indicator {
    $size: 12px;
    display: inline-block;
    height: $size;
    width: $size;
    background: red;
    margin-right: 3px;
    border-radius: 50%;
  }

  &__info-wrapper {
    //border-left: 2px solid $color--light-gray;
  }

  &__info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    min-height: 24px;
    line-height: 16px;
    font-size: 12px;
  }

  &__info-day {
    display: inline-block;
    //&.highlighted {color: $color--blue}
    &:not(:first-child) {padding-left: 2px}
  }
}
</style>
