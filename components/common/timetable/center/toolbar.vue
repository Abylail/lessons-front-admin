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
            <v-list-item v-show="$device.isDesktop" two-line @click="downloadTeacherTables()"><v-icon class="mr-3">mdi-download</v-icon>Скачать расписание для каждого учителя (Несколько файлов)</v-list-item>
            <v-list-item two-line @click="downloadFullTable()"><v-icon class="mr-3">mdi-download</v-icon>Скачать все расписание</v-list-item>
            <v-list-item two-line @click="downloadGroupList()"><v-icon class="mr-3">mdi-download</v-icon>Скачать список групп</v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div class="toolbar__bottom columns-4">
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
            <v-list-item two-line @click="downloadTeacherTables()"><v-icon class="mr-3">mdi-download</v-icon>Скачать расписание для каждого учителя (Несколько файлов)</v-list-item>
            <v-divider/>
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

    // Получить индекс группы (Выщитывается прибываляя время старта и конца)
    getGroupIndex(group, weekDayCode) {
      const {start, end} = group?.days?.find(d => d.code === this.weekDayCode) || {start: "0", end: "0"};
      return +start.replace(":", "") + +end.replace(":", "");
    },

    // Скачать расписание для каждого учителя (в разных файлах)
    downloadTeacherTables() {
      this.teacherList.forEach(teacher => {
        let content = [];

        // Имя преподавателя
        content.push({text: teacher.full_name, style: 'header', fontSize: 20, alignment: "center"});

        // Группы в этого учителя
        const groups = this.groupList.filter(g => g.teacher_id === teacher.id)

        // Получить список групп по дню недели
        const getGroupsByWeek = w => groups
          .filter(g => !!g.days.find(d => d.code === w.code))
          .sort((g1, g2) => this.getGroupIndex(g1, w.code) - this.getGroupIndex(g2, w.code))

        // Группы по дням
        const weekDays = weekdays.map(w => ({...w, groups: getGroupsByWeek(w)})).filter(w => w.groups.length)

        // Бегаю по дня недели создаю таблицы
        weekDays.forEach(weekDay => {

          // День недели
          content.push({text: weekDay.name, marginTop: 20, marginBottom: 5, fontSize: 16, alignment: "center"});

          // Получить row для таблицы по группу
          const getContentRow = group => {
            const {start, end} = group.days.find(d => d.code === weekDay.code);
            return [{text: `${start}-${end}`,alignment: "center"}, group.branch_address]
          }

          // Таблица по этому дню
          content.push({
            table: {
              widths: [80,'*'],
              body: [
                [{text: "Время",fontSize: 14, alignment: "center"}, {text: "Адрес",fontSize: 14}],
                ...weekDay.groups.map(getContentRow)
              ]
            }
          })
        })

        // Скачивание (Если группы есть)
        if (groups.length) pdfMake.createPdf({content}).download(`Расписание ${teacher.full_name}.pdf`);
      })
    },

    // Скачать все расписание (По дням недели)
    downloadFullTable() {
      let content = [];

      // Тайтл
      content.push({text: "Расписание", style: 'header', fontSize: 20, alignment: "center"});

      // Получить список групп по дню недели
      const getGroupsByWeek = w => this.groupList
        .filter(g => !!g.days.find(d => d.code === w.code))
        .sort((g1, g2) => this.getGroupIndex(g1, w.code) - this.getGroupIndex(g2, w.code))

      // Группы по дням
      const weekDays = weekdays.map(w => ({...w, groups: getGroupsByWeek(w)})).filter(w => w.groups.length)

      // Бегаю по дня недели создаю таблицы
      weekDays.forEach(weekDay => {

        // День недели
        content.push({text: weekDay.name, marginTop: 20, marginBottom: 5, fontSize: 16, alignment: "center"});

        // Получить row для таблицы по группу (Время, Учитель, Предмет, Адрес)
        const getContentRow = group => {
          const {start, end} = group.days.find(d => d.code === weekDay.code);
          return [{text: `${start}-${end}`,alignment: "center"}, group.teacher_full_name, group.center_subject_name, group.branch_address]
        }

        // Таблица по этому дню
        content.push({
          table: {
            widths: [80,100, '*', '*'],
            body: [
              [{text: "Время",fontSize: 14, alignment: "center"}, {text: "Учитель", fontSize: 14}, {text: "Предмет", fontSize: 14}, {text: "Адрес (Филиал)",fontSize: 14},],
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
        return [group.teacher_full_name, group.center_subject_name, group.days.map(d => `${weekdaysShortDictionary[d.code]}(${d.start}-${d.end})`).join(", "), group.branch_address]
      }

      // Таблица по этому дню
      content.push({
        marginTop: 20,
        table: {
          widths: [80,100, '*', '*'],
          body: [
            [{text: "Учитель", fontSize: 14}, {text: "Предмет", fontSize: 14}, {text: "Дни и время",fontSize: 14}, {text: "Адрес (Филиал)",fontSize: 14},],
            ...this.groupList.map(getContentRow)
          ]
        }
      })

      pdfMake.createPdf({content}).download(`Список групп.pdf`)
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

}
</style>
