<template>
  <modal name="edit-group" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-group">
      <h2>Группа</h2>

      <div class="edit-group__form">

        <div v-if="!isNewGroup" class="mb-3">
          <h3 class="mb-0">Ссылка на урок</h3>
          <a target="_blank" :href="lessonUrl">{{lessonUrl}}</a>
        </div>

        <h3 class="mb-3">Основное</h3>
        <div class="relative-columns-2">
          <v-select
            label="Предмет (обязательно)"
            v-model="group.institution_subject_id"
            :items="[...centerSubjectList, {name: '+ новый предмет', id: 'new'}]"
            item-text="name" item-value="id"
            outlined dense
            @change="$event === 'new' ? createNewCenterSubject() : null"
          />
          <v-select
            label="Филиал (обязательно)"
            v-model="group.institution_branch_id"
            :items="[...branchList, {address: '+ новый филиал', id: 'new'}]"
            item-text="address" item-value="id"
            outlined dense
            @change="$event === 'new' ? createNewBranch() : null"
          />
        </div>

<!--        <h3 class="mb-3">Описание группы</h3>-->
<!--        <v-textarea-->
<!--          label="Описание группы на русском" rows="2"-->
<!--          v-model="group.description"-->
<!--          outlined dense auto-grow-->
<!--        />-->

        <h3 class="mb-3">Цена</h3>
        <div class="relative-columns-3">
          <v-text-field
            label="Цена (тг/мес) (обязательно)"
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

        <h3 class="mb-3">Набор в группу</h3>
        <div class="relative-columns-3">
          <v-switch
            class="mt-0" label="Ведется набор"
            v-model="group.open_enrollment"
            dense
          />
        </div>

        <h3 class="mb-3">Детей в группе</h3>
        <div class="relative-columns-3">
          <v-text-field
            label="Макс детей в группе (обязательно)" type="number"
            v-model.number="group.max_children_count"
            outlined dense
          />
        </div>

        <days-control v-model="group"/>

        <div class="relative-columns-4">
          <v-btn class="mb-2" color="primary" :loading="isLoading" block @click="saveGroup()">Сохранить</v-btn>
          <!-- Удалить и отменить -->
          <div class="edit-group__extra-actions">
            <v-btn class="edit-group__delete" color="red" dark block @click="deleteHandle()"><v-icon>mdi-delete</v-icon></v-btn>
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
const defaultGroupInfo = {price_trial: 0, language_ru: true, language_kz: false, open_enrollment: true};

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
      allGroups: "center/timetable/getGroupList",
    }),

    // Новая ли группа (создание или апдейт)
    isNewGroup() {
      return !this.group.id;
    },

    lessonUrl() {
      return `https://kidup.kz/catalog/details/lesson-${this.group.institution_subject_id}`;
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

      // Если набор в группу null (open_enrollment)
      if (this.group.open_enrollment === null) this.group.open_enrollment = true;

      // Начальный день
      if (this.$modal.$payload?.dayCode) this.createDefaultDay(this.$modal.$payload.dayCode)

      // Дописать предположительную информацию
      if (this.isNewGroup) this.initSupposeInfo();
    },

    // Вставить предположительную информацию (Только для создания)
    initSupposeInfo() {
      if (!this.isNewGroup || !this.allGroups.length) return;
      // Просто беру последнюю группу и вставляю некоторые поля
      const {max_age, min_age, max_children_count, price_trial} = this.allGroups[this.allGroups.length - 1];
      this.group = {...this.group, max_age, min_age, max_children_count, price_trial}
    },

    // Создать начальный день недели
    createDefaultDay(weekDayCode) {
      const startCode = `${weekDayCode}_start`;
      const endCode = `${weekDayCode}_end`;
      this.group = {[startCode]: "", [endCode]: "", ...this.group}
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
        let isSuccessFullUpdate = false;

        if (this.isNewGroup) isSuccessFullUpdate = await this._createGroup(this.group);
        else isSuccessFullUpdate = await this._updateGroup(this.group);

        if (isSuccessFullUpdate) this.closeSelf();
      }
      this.isLoading = false;
    },

    // Удалить кнопка
    async deleteHandle() {
      const deleteGroup = JSON.parse(JSON.stringify(this.group));
      this.closeSelf();
      setTimeout(() => {
        this.$modal.show("remove-group", {group: deleteGroup});
      }, 300);
    },

    // Создание нового учителя (открывается модалка по созданию, затем обратно в эту модалку)
    createNewTeacher() {
      this.group.teacher_id = null;
      let groupInfo = JSON.parse(JSON.stringify(this.group));

      setTimeout(() => {
        this.$modal.show("edit-teacher", {
          successCallback: ({ id }) => {
            groupInfo.teacher_id = id;
            this.$modal.show("edit-group", {group: groupInfo});
          }});
      }, 300);

      this.closeSelf();
    },

    // Создание нового учителя (открывается модалка по созданию, затем обратно в эту модалку)
    createNewBranch() {
      this.group.institution_branch_id = null;
      let groupInfo = JSON.parse(JSON.stringify(this.group));

      setTimeout(() => {
        this.$modal.show("edit-branch", {
          successCallback: ({ id }) => {
            groupInfo.institution_branch_id = id;
            this.$modal.show("edit-group", {group: groupInfo});
          }});
      }, 300);

      this.closeSelf();
    },

    // Создание нового учителя (открывается модалка по созданию, затем обратно в эту модалку)
    createNewCenterSubject() {
      this.group.institution_subject_id = null;
      let groupInfo = JSON.parse(JSON.stringify(this.group));

      setTimeout(() => {
        this.$modal.show("edit-subject", {
          successCallback: ({ id }) => {
            groupInfo.institution_subject_id = id;
            this.$modal.show("edit-group", {group: groupInfo});
          }});
      }, 300);

      this.closeSelf();
    },
  }
}
</script>

<style lang="scss" scoped>
.edit-group {

  &__form {
    margin-top: 10px;
    padding-top: 10px;
    padding-right: 15px;
    max-height: calc(80vh - 100px);
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
  }

  &__actions {
    text-align: right;
  }

  &__extra-actions {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-column-gap: 10px;
  }

  &__delete {
    min-width: 0 !important;
    max-width: 40px !important;
  }

}
</style>
