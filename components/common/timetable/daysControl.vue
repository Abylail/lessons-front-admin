<template>
  <div class="days-control">

    <h3 class="days-control__title mb-2">Дни недели</h3>

    <div class="days-control__weekdays">
      <div class="days-control__weekday" v-for="weekday in weekdays" :key="weekday.code">
        <div class="days-control__weekday-title">{{ weekday.shortName }}</div>

        <!-- Уже создан (Контроль полей и удаление дня) -->
        <div v-if="isDayCreated(weekday.code)" class="days-control__controls">
          <v-text-field
            label="Старт" v-mask="'##:##'"
            :value="getDayValue(weekday.code, 'start')"
            dense hide-details outlined
            @input="setDayValue(weekday.code, 'start', $event)"
          />
          <v-text-field
            class="ml-1" label="Конец" v-mask="'##:##'"
            :value="getDayValue(weekday.code, 'end')"
            dense hide-details outlined
            @input="setDayValue(weekday.code, 'end', $event)"
          />
          <v-btn class="ml-1" color="red" height="40" dark @click="deleteDay(weekday.code)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>

        <!-- Не создан (Создание дня) -->
        <div v-else class="days-control__add-wrapper">
          <v-btn small color="primary" outlined @click="addDay(weekday.code)">+ добавить</v-btn>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {weekdays} from "@/config/lists";

export default {
  name: "daysControl",
  props: {
    value: {
      type: Object,
      default: () => ({}) //{monday_start,monday_end,... }
    },
  },
  data: () => ({
    // Дни недели
    weekdays,
  }),
  methods: {

    // Получить значение из дня (property = "start"|"end")
    getDayValue(weekDayCode, property) {
      return this.value[`${weekDayCode}_${property}`];
    },

    // Обновить данные дня
    setDayValue(weekDayCode, property, value) {
      let newValue = {...this.value};
      newValue[`${weekDayCode}_${property}`] = value;
      this.$emit("input", newValue);
    },

    // День создан
    isDayCreated(weekDayCode) {
      return typeof this.value[`${weekDayCode}_start`] === "string" && typeof this.value[`${weekDayCode}_end`] === "string";
    },

    // Получить предположительное время -> {start, end}
    // getSupposeTime() {
    //   if (!this.value.length) return {};
    //   // Беру последнее время в списке
    //   const {start, end} = this.value[this.value.length - 1];
    //   return {start, end};
    // },

    // Добавить урок в этот день
    addDay(weekDayCode) {
      let newValue = {...this.value};
      newValue[`${weekDayCode}_start`] = "";
      newValue[`${weekDayCode}_end`] = "";
      this.$emit("input", newValue);
    },

    // Удалить день
    deleteDay(weekDayCode) {
      let newValue = {...this.value};
      newValue[`${weekDayCode}_start`] = null;
      newValue[`${weekDayCode}_end`] = null;
      this.$emit("input", newValue);
    }
  }
}
</script>

<style lang="scss" scoped>
.days-control {
  margin-bottom: 20px;

  &__weekday {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-column-gap: 10px;
  }

  &__weekday-title {
    font-size: 18px;
    line-height: 40px;
    border-right: 1px solid black;
  }

  &__controls {
    display: flex;
    flex-direction: row;
    padding: 5px 0;
    & > * {
      max-width: 85px;
    }
  }

  &__add-wrapper {
    display: flex;
    align-items: center;
  }
}
</style>
