<template>
  <div class="toolbar">

    <!-- DESKTOP VIEW -->
    <div class="toolbar--desktop" v-if="$device.isDesktop">
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
            <v-list-item two-line @click="downloadFullTable()"><v-icon class="mr-3">mdi-download</v-icon>Скачать все расписание</v-list-item>
            <v-list-item two-line @click="downloadGroupList()"><v-icon class="mr-3">mdi-download</v-icon>Скачать список групп</v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="toolbar__bottom">
        <v-select
          label="Предметы" placeholder="Все предметы"
          v-model="innerFilterParams.institution_subject_id"
          :items="centerSubjectList"
          item-text="name" item-value="id"
          multiple outlined dense hide-details persistent-placeholder
        />
        <v-select
          label="Дни недели" placeholder="Все дни недели"
          v-model="innerFilterParams.days"
          :items="weekdays"
          item-text="name" item-value="code" height="40"
          multiple outlined dense hide-details persistent-placeholder
        />
        <v-select
          v-if="branchList.length > 1"
          clabel="Филиалы" placeholder="Все филиалы"
          v-model="innerFilterParams.institution_branch_id"
          :items="branchList"
          item-text="address" item-value="id" height="40"
          multiple outlined dense hide-details persistent-placeholder clearable
        />
        <v-btn color="primary" @click="filterHandle()">Применить</v-btn>
      </div>
    </div>

    <!-- MOBILE VIEW -->
    <div class="toolbar--mobile" v-if="$device.isMobileOrTablet">
      <h2>Расписание</h2>
      <div>

        <!-- Дополнительные кнопки (скачать) -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item two-line @click="downloadFullTable()"><v-icon class="mr-3">mdi-download</v-icon>Скачать все расписание (По дням)</v-list-item>
            <v-divider/>
            <v-list-item two-line @click="downloadGroupList()"><v-icon class="mr-3">mdi-download</v-icon>Скачать список групп</v-list-item>
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
    <v-navigation-drawer class="toolbar__aside" v-model="showMobileFilterBar" v-if="$device.isMobileOrTablet" width="300" right fixed app>
      <div class="toolbar__aside pa-3">
        <div class="toolbar__aside-title">
          <h2>Фильтр</h2>
        </div>
        <div class="toolbar__aside-filters">
          <v-select
            class="mb-3" label="Предметы" placeholder="Все предметы"
            v-model="innerFilterParams.institution_subject_id"
            :items="centerSubjectList"
            item-text="name" item-value="id"
            multiple outlined hide-details persistent-placeholder clearable
          />
          <v-select
            class="mb-3" label="Дни недели" placeholder="Все дни недели"
            v-model="innerFilterParams.days"
            :items="weekdays"
            item-text="name" item-value="code" height="40"
            multiple outlined dense hide-details persistent-placeholder clearable
          />
          <v-select
            v-if="branchList.length > 1"
            class="mb-3" label="Филиалы" placeholder="Все филиалы"
            v-model="innerFilterParams.institution_branch_id"
            :items="branchList"
            item-text="address" item-value="id" height="40"
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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
      // _fetchTeachers: "center/teachers/fetchTeacherList",
      _fetchCenterSubjects: "center/subjects/fetchSubjectCenterList",
      _fetchBranches: "center/branches/fetchBranchList",
    }),

    // Запросить учителей
    // async fetchTeachers() {
    //   this.isTeacherLoading = true;
    //   await this._fetchTeachers();
    //   this.isTeacherLoading = false;
    // },

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

    // Получить индекс группы (Выщитывается прибываляя время старта и конца)
    getGroupIndex(group, weekDayCode) {
      const start = group[`${weekDayCode}_start`] || "0";
      const end = group[`${weekDayCode}_end`] || "0";
      return +start.replace(":", "") + +end.replace(":", "");
    },

    // Скачать все расписание (По дням недели)
    downloadFullTable() {
      let content = [];

      // Тайтл
      content.push({text: "Расписание", style: 'header', fontSize: 20, alignment: "center"});

      // Получить список групп по дню недели
      const getGroupsByWeek = w => this.groupList
        .filter(group => !!group[`${w.code}_start`] && !!group[`${w.code}_end`])
        .sort((g1, g2) => this.getGroupIndex(g1, w.code) - this.getGroupIndex(g2, w.code))

      // Группы по дням
      const weekDays = weekdays.map(w => ({...w, groups: getGroupsByWeek(w)})).filter(w => w.groups.length)

      // Бегаю по дня недели создаю таблицы
      weekDays.forEach(weekDay => {

        // День недели
        content.push({text: weekDay.name, marginTop: 20, marginBottom: 5, fontSize: 16, alignment: "center"});

        // Получить row для таблицы по группу (Время, Предмет, Адрес)
        const getContentRow = group => {
          const start = group[`${weekDay.code}_start`];
          const end = group[`${weekDay.code}_end`];
          return [{text: `${start}-${end}`,alignment: "center"}, group.institutionSubject.name, group.institutionBranch.address]
        }

        // Таблица по этому дню
        content.push({
          table: {
            widths: [80,'*', '*'],
            body: [
              [{text: "Время",fontSize: 14, alignment: "center"}, {text: "Предмет", fontSize: 14}, {text: "Адрес (Филиал)",fontSize: 14},],
              ...weekDay.groups.map(getContentRow)
            ]
          }
        })
      })

      pdfMake.createPdf({content}).download(`Расписание.pdf`)
    },

    // Скачать список групп
    downloadGroupList() {
      let content = [];

      // Тайтл
      content.push({text: "Список групп", style: 'header', fontSize: 20, alignment: "center"});

      // Получить row для таблицы по группу (Время, Учитель, Предмет, Адрес)
      const getContentRow = group => {
        return [group.institutionSubject?.name, weekdays.filter(weekday => group[`${weekday.code}_start`] && group[`${weekday.code}_end`]).map(weekDay => `${weekdaysShortDictionary[weekDay.code]}(${group[`${weekDay.code}_start`]}-${group[`${weekDay.code}_end`]})`).join(", "), group.institutionBranch?.address]
      }

      // Таблица по этому дню
      content.push({
        marginTop: 20,
        table: {
          widths: [120, '*', '*'],
          body: [
            [{text: "Предмет", fontSize: 14}, {text: "Дни и время",fontSize: 14}, {text: "Адрес (Филиал)",fontSize: 14},],
            ...this.groupList.map(getContentRow)
          ]
        }
      })

      pdfMake.createPdf({content}).download(`Список групп.pdf`)
    }
  },
  mounted() {
    // this.fetchTeachers();
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

  &__bottom {
    display: flex;
    column-gap: 8px;
    * > {
      flex: 1;
    }
  }

}
</style>
