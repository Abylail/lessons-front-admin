<template>
  <div class="toolbar">

    <!-- DESKTOP VIEW -->
    <div class="toolbar--desktop">
      <div class="toolbar__top">
        <h2>Фильтр</h2>

        <!-- Дополнительные кнопки -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="ml-3" v-bind="attrs" v-on="on" icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item two-line @click="downloadTeacherTables()"><v-icon class="mr-3">mdi-download</v-icon>Скачать расписание для каждого учителя (Несколько файлов)</v-list-item>
            <v-list-item two-line @click="downloadFullTable()"><v-icon class="mr-3">mdi-download</v-icon>Скачать все расписание</v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="toolbar__bottom relative-columns-4">
        <v-select
          label="Учителя" placeholder="Все учителя"
          v-model="innerFilterParams.teacher_id"
          :items="teacherList"
          item-text="full_name" item-value="id"
          multiple outlined dense hide-details persistent-placeholder
        />
        <v-select
          label="Предметы" placeholder="Все предметы"
          v-model="innerFilterParams.center_subject_id"
          :items="centerSubjectList"
          item-text="ru.name" item-value="id"
          multiple outlined dense hide-details persistent-placeholder
        />
        <v-select
          label="Дни недели" placeholder="Все дни недели"
          v-model="innerFilterParams.days"
          :items="weekdays"
          item-text="name" item-value="code" height="40"
          multiple outlined dense hide-details persistent-placeholder
        />
        <v-btn color="primary" @click="filterHandle()">Применить</v-btn>
      </div>
    </div>

    <!-- MOBILE VIEW -->
    <div class="toolbar--mobile">
      <h2>Расписание</h2>
      <div>

        <!-- Дополнительные кнопки -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item two-line @click="downloadTeacherTables()"><v-icon class="mr-3">mdi-download</v-icon>Скачать расписание для каждого учителя (Несколько файлов)</v-list-item>
            <v-list-item two-line @click="downloadFullTable()"><v-icon class="mr-3">mdi-download</v-icon>Скачать все расписание</v-list-item>
          </v-list>
        </v-menu>

        <!-- Открыть фильтр -->
        <v-badge color="green" :content="filterCount" overlap :value="!!filterCount">
          <v-btn color="primary" small @click="openMobileFilter()">
            <v-icon>mdi-filter</v-icon>
            Фильтр
          </v-btn>
        </v-badge>

      </div>
    </div>

    <!-- Боковой фильтр -->
    <v-navigation-drawer class="toolbar__aside" v-model="showMobileFilterBar" width="300" right fixed app>
      <div class="toolbar__aside pa-3">
        <div class="toolbar__aside-title">
          <h2>Фильтр</h2>
        </div>
        <div class="toolbar__aside-filters">
          <v-select
            class="mb-3" label="Учителя" placeholder="Все учителя"
            v-model="innerFilterParams.teacher_id"
            :items="teacherList"
            item-text="full_name" item-value="id"
            multiple outlined dense hide-details persistent-placeholder clearable
          />
          <v-select
            class="mb-3" label="Предметы" placeholder="Все предметы"
            v-model="innerFilterParams.center_subject_id"
            :items="centerSubjectList"
            item-text="ru.name" item-value="id"
            multiple outlined hide-details persistent-placeholder clearable
          />
          <v-select
            class="mb-3" label="Дни недели" placeholder="Все дни недели"
            v-model="innerFilterParams.days"
            :items="weekdays"
            item-text="name" item-value="code" height="40"
            multiple outlined dense hide-details persistent-placeholder clearable
          />
        </div>
      </div>

      <!-- Нижняя часть -->
      <template v-slot:append>
        <div class="pa-3">
          <v-btn class="mb-2" color="primary" block @click="filterHandle()">Применить</v-btn>
          <v-btn block outlined @click="cancelHandle()">Отменить</v-btn>
        </div>
      </template>

    </v-navigation-drawer>


  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {weekdays} from "@/config/lists";
import {weekdaysDictionary, weekdaysShortDictionary} from "../../../../config/lists";

export default {
  name: "toolbar",
  props: {
    filterParams: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({

    // Дни недели
    weekdays,

    // Загрузка учителей
    isTeacherLoading: true,

    // Загрузка предметов центра
    isCenterSubjectLoading: true,

    // Загрузка филиалов
    isBranchesLoading: true,

    // Параметры фильтра
    innerFilterParams: {},

    // Показать боковое фильтр (мобилка)
    showMobileFilterBar: false,

  }),
  computed: {
    ...mapGetters({
      groupList: "center/timetable/getGroupList",
      teacherList: "center/teachers/getTeacherList",
      centerSubjectList: "center/subjects/getCenterSubjectList",
      branchList: "center/branches/getBranchList",
    }),

    // Колличество использованных фильтров
    filterCount() {
      if (!this.filterParams) return 0;
      let count = 0;
      Object.keys(this.filterParams).forEach(fKey => {
        if (this.filterParams[fKey].length) count++;
      })
      return count;
    }
  },
  watch: {
    filterParams(val) {
      this.innerFilterParams = JSON.parse(JSON.stringify(val));
    }
  },
  methods: {
    ...mapActions({
      _fetchTeachers: "center/teachers/fetchTeacherList",
      _fetchCenterSubjects: "center/subjects/fetchSubjectCenterList",
      _fetchBranches: "center/branches/fetchBranchList",
    }),

    // Запросить учителей
    async fetchTeachers() {
      this.isTeacherLoading = true;
      await this._fetchTeachers();
      this.isTeacherLoading = false;
    },

    // Запросить предметы центра
    async fetchCenterSubjects() {
      this.isCenterSubjectLoading = true;
      await this._fetchCenterSubjects();
      this.isCenterSubjectLoading = false;
    },

    // Запросить предметы центра
    async fetchBranches() {
      this.isBranchesLoading = true;
      await this._fetchBranches();
      this.isBranchesLoading = false;
    },

    // Открыть боковой фильтр (Мобильный)
    openMobileFilter() {
      this.innerFilterParams = JSON.parse(JSON.stringify(this.filterParams));
      this.showMobileFilterBar = true;
    },

    // Очистить фильтр
    clear() {
      this.innerFilterParams = {};
    },

    // Закрыть боковой фильтр
    closeSelf() {
      this.showMobileFilterBar = false;
    },

    // Кнопка применить фильтр
    filterHandle() {
      this.$emit("update:filterParams", this.innerFilterParams);
      this.closeSelf();
    },

    // Отменить фильтр
    cancelHandle() {
      this.closeSelf();
    },

    // Скачать расписание для каждого учителя
    downloadTeacherTables() {

    },

    // Скачать все расписание
    downloadFullTable() {
      // const svgElement = document.createElement("svg");
      //
      // const container = document.createElement("foreigOobject")
      // container.style.padding = "20px";
      // svgElement.appendChild(container)
      //
      // const containerTitle = document.createElement("h1");
      // containerTitle.innerText = "Расписание";
      // container.appendChild(containerTitle);
      //
      //
      // const groupTable = document.createElement("table");
      // groupTable.border = "1";
      // container.appendChild(groupTable);
      //
      // const headRow = document.createElement("tr");
      // groupTable.appendChild(headRow);
      //
      // ["Дни", "Учитель", "Адрес"].forEach(headTitle => {
      //   const td = document.createElement("td");
      //   td.innerText = headTitle;
      //   headRow.appendChild(td) ;
      // })
      //
      // this.groupList.forEach(group => {
      //   const bodyRow = document.createElement("tr");
      //   groupTable.appendChild(bodyRow);
      //
      //   const tdDaysString = group.days.map(d => `${weekdaysShortDictionary[d.code]}:${d.start}-${d.end}`).join(", ");
      //   const tdDays = document.createElement("td");
      //   tdDays.innerText = tdDaysString;
      //   bodyRow.appendChild(tdDays);
      //
      //   ["teacher_full_name", "branch_address"].forEach(key => {
      //
      //   })
      //
      // })
      //
      // let serializer = new XMLSerializer();
      // let source = serializer.serializeToString(svgElement);
      // source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      // //convert svg source to URI data scheme.
      // let url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
      // //set url value to a element's href attribute.
      // const forClick = document.createElement("a");
      // forClick.href = url;
      // forClick.download = "Расписание.svg";
      // console.log(url);
      // forClick.click();
    }
  },
  mounted() {
    this.fetchTeachers();
    this.fetchCenterSubjects();
    this.fetchBranches();
  }
}
</script>

<style lang="scss" scoped>
.toolbar {

  &--desktop {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 10px;
  }

  &--mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__top {
    display: flex;
    flex-direction: row;
  }

  &__aside {
    height: 100% !important;
  }

  &__aside-title {
    margin-bottom: 10px;
  }

  &__extra-button {

  }


  @media (max-width: $break-point) {
    &--desktop {display: none}
  }

  @media (min-width: $break-point) {
    &--mobile {display: none}
  }

}
</style>
