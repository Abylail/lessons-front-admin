<template>
  <modal name="edit-group" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-group">
      <h2>Группа</h2>

      <div class="edit-group__form">

        <h3 class="mb-3">Основное</h3>
        <div class="relative-columns-3">
          <v-select
            label="Учитель"
            v-model="group.teacher_id"
            :items="teacherList"
            item-text="full_name" item-value="id"
            outlined dense
          />
          <v-select
            label="Предмет"
            v-model="group.center_subject_id"
            :items="centerSubjectList"
            item-text="ru.name" item-value="id"
            outlined dense
          />
          <v-select
            label="Филиал"
            v-model="group.branch_id"
            :items="branchList"
            item-text="address" item-value="id"
            outlined dense
          />
        </div>

        <h3 class="mb-3">Описание группы</h3>
        <div class="relative-columns-2">
          <v-textarea
            label="Описание группы на русском" rows="2"
            v-model="group.ru.description"
            outlined dense auto-grow
          />
          <v-textarea
            label="Описание группы на казахском" rows="2"
            v-model="group.kz.description"
            outlined dense auto-grow
          />
        </div>

        <h3 class="mb-3">Цена</h3>
        <div class="relative-columns-3">
          <v-text-field
            label="Цена (тг/мес)"
            v-model.number="group.price"
            outlined dense
            type="price"
          />
          <v-text-field
            label="Цена пробного урока (тг)" type="number"
            v-model.number="group.price_trial"
            outlined dense
          />
        </div>

        <h3 class="mb-3">Возраст</h3>
        <div class="relative-columns-3">
          <v-text-field
            label="Минимальный возраст" placeholder="Любой" type="number"
            v-model.number="group.min_age"
            outlined dense persistent-placeholder
          />
          <v-text-field
            label="Максимальный возраст" placeholder="Любой" type="number"
            v-model.number="group.max_age"
            outlined dense persistent-placeholder
          />
        </div>

        <h3 class="mb-3">Язык</h3>
        <div class="relative-columns-3">
          <v-switch
            class="mt-0" label="Урок на русском"
            v-model="group.language_ru"
            dense
          />
          <v-switch
            class="mt-0" color="green" label="Урок на казахском"
            v-model="group.language_kz"
            dense
          />
        </div>

        <h3 class="mb-3">Детей в группе</h3>
        <div class="relative-columns-3">
          <v-text-field
            label="Макс детей в группе" type="number"
            v-model.number="group.max_children_count"
            outlined dense
          />
        </div>

        <days-control v-model="group.days"/>

        <div class="relative-columns-4">
          <v-btn class="mb-2" color="primary" :loading="isLoading" block @click="saveGroup()">Сохранить</v-btn>
          <!-- Удалить и отменить -->
          <div class="edit-group__extra-actions">
            <v-btn color="red" dark block><v-icon>mdi-delete</v-icon></v-btn>
            <v-btn block outlined @click="closeSelf()">Отменить</v-btn>
          </div>
        </div>

      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import DaysControl from "@/components/common/timetable/daysControl";
const defaultGroupInfo = {ru: {description: null}, kz: {description: null}, days: [], price_trial: 0, language_ru: true, language_kz: false};

export default {
  name: "editGroupModal",
  components: {DaysControl},
  data: () => ({
    // Информация группы
    group: JSON.parse(JSON.stringify(defaultGroupInfo)),

    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      teacherList: "center/teachers/getTeacherList",
      centerSubjectList: "center/subjects/getCenterSubjectList",
      branchList: "center/branches/getBranchList",
    }),
    // Новая ли группа (создание или апдейт)
    isNewGroup() {
      return !this.group.id;
    }
  },
  methods: {
    ...mapActions({
      _updateGroup: "center/timetable/updateGroup",
      _createGroup: "center/timetable/createGroup",
    }),

    // Получить вложения
    getPayload() {
      // Инфо группы
      if (this.$modal.$payload?.group) {this.group = JSON.parse(JSON.stringify(this.$modal.$payload.group))}

      // Начальный день
      if (this.$modal.$payload?.dayCode) this.createDefaultDay(this.$modal.$payload.dayCode)
    },

    // Создать начальный день недели
    createDefaultDay(weekDayCode) {
      this.group.days.push({ code: weekDayCode })
    },

    // Очистка информации
    clear() {
      this.group = JSON.parse(JSON.stringify(defaultGroupInfo));
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("edit-group");
    },

    // Валидация группы
    async validate() {
      return true;
    },

    // Сохранить или создать группу
    async saveGroup() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewGroup) await this._createGroup(this.group);
        // else await this._updateGroup(this.group);
        this.closeSelf();
      }
      this.isLoading = false;
      console.log(this.group);
    },
  }
}
</script>

<style lang="scss" scoped>
.edit-group {

  &__form {
    margin-top: 10px;
    padding-top: 10px;
    max-height: calc(80vh - 100px);
    overflow-y: auto;
  }

  &__actions {
    text-align: right;
  }

  &__extra-actions {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-column-gap: 10px;
  }

}
</style>
