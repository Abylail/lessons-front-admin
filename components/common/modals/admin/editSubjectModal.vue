<template>
  <modal name="edit-subject" size="small" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-subject">
      <h2>Предмет</h2>

      <div class="edit-subject__form">
        <v-text-field label="Название" v-model="subject.name" outlined dense/>
        <v-switch label="Спорт" v-model="subject.is_sport" dense/>
        <v-select label="Категории" item-text="name" item-value="code" v-model="subject.categories" :items="categories" outlined dense multiple/>
        <base-color-picker label="Цвет предмета" v-model="subject.color"/>
      </div>

      <div class="edit-teacher__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveSubject()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BaseColorPicker from "@/components/base/BaseColorPicker";

export default {
  name: "editSubjectModal",
  components: {BaseColorPicker},
  data: () => ({
    // Информация категории
    subject: {},

    // Старая информация предмета (для сравнения категорий)
    oldSubject: {},

    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      categories: "admin/categories/getCategoryList",
    }),
    // Новая ли категория
    isNewSubject() {
      return !this.subject.id;
    }
  },
  methods: {
    ...mapActions({
      _createSubject: "admin/subjects/createSubject",
      _updateSubject: "admin/subjects/updateSubject",
    }),
    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.subject) {
        this.subject = this.createEditableSubject(this.$modal.$payload.subject);
        this.oldSubject = this.createEditableSubject(this.$modal.$payload.subject);
      }
    },
    // Создание объекта для изменений (categories переводит в список id категорий)
    createEditableSubject(subject) {
      return {
        ...JSON.parse(JSON.stringify(subject)),
        categories: (subject.categories || []).map(s => s.code),
      }
    },
    // Очистить
    clear() {
      this.subject = {};
      this.oldSubject = {};
    },
    // Закрыть себя (Модалку)
    closeSelf() {
      this.$modal.hide("edit-subject");
    },
    // Валидация информации категории
    async validate() {
      if (!this.subject.name) {
        return false;
      }
      return true;
    },
    // Сохранить категорию
    async saveSubject() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewSubject) await this._createSubject(this.subject);
        else await this._updateSubject(this.subject);
        this.closeSelf();
      }
      this.isLoading = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.edit-subject {

  &__form {
    margin-top: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
