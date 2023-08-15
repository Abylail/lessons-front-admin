<template>
  <div class="time-table">

    <column
      v-for="weekDay in weekdays" :key="weekDay.code"
      v-show="canShow(weekDay.code)"
      :label="weekDay.name"
      :list="listByWeekDay[weekDay.code]"
      :week-day-code="weekDay.code"
      @create="editItem({dayCode: weekDay.code})"
      @update="editItem({ group: $event })"
    />

  </div>
</template>

<script>
import {weekdays} from "@/config/lists";
import Column from "@/components/common/timetable/column";

export default {
  name: "timeTable",
  components: {Column},
  props: {
    list: {
      type: Array,
      default: () => []
    },
    hideDaysCode: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    // Дни недели
    weekdays,
  }),
  computed: {
    // Объект с ключами дней недели и списком
    listByWeekDay() {
      let result = {};

      // Пробегаюсь по группам
      this.list.forEach(group => {

        // Пробегаюсь по дням группы что бы везде записать
        weekdays.forEach(({code}) => {
          const startCode = `${code}_start`;
          const endCode = `${code}_end`;
          if (group[startCode] && group[endCode]) {
            if (!result[code]) result[code] = [];
            result[code].push(group);
          }
        });
      })

      return result;
    },
  },
  methods: {

    // Можно ли показывать колонку
    canShow(dayCode) {
      return this.hideDaysCode.indexOf(dayCode) < 0;
    },

    // Создать
    editItem(event) {
      this.$emit("editGroup", event);
    },
  }
}
</script>

<style lang="scss" scoped>
.time-table {
  user-select: none;
  height: 100%;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  white-space: nowrap;
  padding-bottom: 20px;

  @media (max-width: $break-point) {
    scroll-snap-type: x mandatory;
  }
}
</style>
