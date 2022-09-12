<template>
  <div class="work-schedule">
    <div
      class="work-schedule__day"
      :class="{'work-schedule__day--active': isDayActive(dayKey)}"
      v-for="dayKey in dayKeys" :key="dayKey"
      @click="dayClickHandle(dayKey)"
    >
      <div class="work-schedule__day-name">
        <span>{{ getName(dayKey) }}</span>
        <v-spacer/>
        <v-btn v-if="isDayActive(dayKey)" icon color="red" @click.stop="deleteHandle(dayKey)"><v-icon small>mdi-delete</v-icon></v-btn>
        <v-btn v-else icon><v-icon small>mdi-plus</v-icon></v-btn>
      </div>


      <div class="work-schedule__day-times" v-if="isDayActive(dayKey)">
        <v-text-field
          v-mask="'##:##'"
          :value="getStartTime(dayKey)"
          @input="setStartTime(dayKey, $event)"
        />
        <v-text-field
          v-mask="'##:##'"
          :value="geEndTime(dayKey)"
          @input="setEndTime(dayKey, $event)"
        />
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "workSchedule",
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dayDescription: {
      monday: {shortName: "Пн", name: "Понедельник"},
      tuesday: {shortName: "Вт", name: "Вторник"},
      wednesday: {shortName: "Ср", name: "Среда"},
      thursday: {shortName: "Чт", name: "Четверг"},
      friday: {shortName: "Пт", name: "Пятница"},
      saturday: {shortName: "Сб", name: "Суббота"},
      sunday: {shortName: "Вс", name: "Воскресение"},
    }
  }),
  computed: {
    dayKeys() {
      return Object.keys(this.dayDescription)
    }
  },
  methods: {
    isDayActive(dayKey) {
      return this.value && !!this.value[dayKey];
    },
    getName(dayKey) {
      return this.dayDescription[dayKey].shortName;
    },


    getStartTime(dayKey) {
      return this.value[dayKey].start;
    },
    setStartTime(dayKey, val) {
      let newVal = {...this.value};
      newVal[dayKey].start = val;
      this.$emit("input", newVal);
    },
    geEndTime(dayKey) {
      return this.value[dayKey].end;
    },
    setEndTime(dayKey, val) {
      let newVal = {...this.value};
      newVal[dayKey].end = val;
      this.$emit("input", newVal);
    },


    dayClickHandle(dayKey) {
      if (this.value[dayKey]) return;
      let newVal = {...this.value};
      newVal[dayKey] = {start: "09:00", end: "18:00"};
      this.$emit("input", newVal);
    },
    deleteHandle(dayKey) {
      let newVal = {...this.value};
      newVal[dayKey] = null;
      this.$emit("input", newVal);
    }
  }
}
</script>

<style lang="scss" scoped>
.work-schedule {
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;

  @media (max-width: $break-point) {
    display: flex;
    flex-direction: column;
  }

  &__day {
    background: #efefef;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    margin: 5px;
    transition: .3s;
    min-height: 190px;

    &--active {
      color: #1976d2;
      background: rgba(25, 118, 210, 0.1);
    }
  }

  &__day-name {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

}
</style>
