<template>
  <modal name="edit-group" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-group">
      <h2>Группа</h2>

      <div class="edit-group__form">

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

        <div class="relative-columns-3">
          <v-text-field
            label="Цена (тг/мес)" type="number"
            v-model="group.price"
            outlined dense
          />
          <v-text-field
            label="Цена пробного урока (тг)" type="number"
            v-model="group.price_trial"
            outlined dense
          />
        </div>

        <div class="relative-columns-3">
          <v-text-field
            label="Минимальный возраст" placeholder="Любой" type="number"
            v-model="group.min_age"
            outlined dense persistent-placeholder
          />
          <v-text-field
            label="Максимыльный возраст" placeholder="Любой" type="number"
            v-model="group.max_age"
            outlined dense persistent-placeholder
          />
        </div>

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

        <div class="relative-columns-3">
          <v-text-field
            label="Макс детей в группе" type="number"
            v-model="group.max_children_count"
            outlined dense
          />
        </div>

        <div class="relative-columns-4">
          <v-btn class="mb-2" color="primary" :loading="isLoading" block @click="saveGroup()">Сохранить</v-btn>
          <v-btn block @click="closeSelf()">Отменить</v-btn>
        </div>

      </div>
    </div>
  </modal>
</template>

<script>
import {mapGetters} from "vuex";
const defaultGroupInfo = {ru: {}, kz: {}, days: [], price_trial: 0, language_ru: true, language_kz: false};

export default {
  name: "editGroupModal",
  data: () => ({
    // Информация группы
    group: {...defaultGroupInfo},

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
      return this.group.id;
    }
  },
  methods: {

    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.group) {
        this.group = {...this.$modal.$payload.group};
      }
    },

    // Очистка информации
    clear() {
      this.group = {...defaultGroupInfo};
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("edit-group");
    },

    // Сохранить или создать группу
    saveGroup() {

    },
  }
}
</script>

<style lang="scss" scoped>
.edit-group {

  &__form {
    margin-top: 20px;
    max-height: calc(90vh - 100px);
    overflow-y: auto;
  }

  &__actions {
    text-align: right;
  }

}
</style>
