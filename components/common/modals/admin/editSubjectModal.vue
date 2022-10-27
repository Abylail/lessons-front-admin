<template>
  <modal name="edit-subject" size="small" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-subject">
      <h2>Предмет</h2>

      <div class="edit-subject__form">
        <v-text-field label="Название на русском" v-model="subject.ru.name" outlined dense/>
        <v-text-field label="Название на казахском" v-model="subject.kz.name" outlined dense hide-details/>
        <v-switch label="Спорт" v-model="subject.is_sport" dense/>
        <v-select label="Категории" item-text="ru.name" item-value="id" v-model="subject.categories" :items="categories" outlined dense multiple/>
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

export default {
  name: "editSubjectModal",
  data: () => ({
    // Информация категории
    subject: {ru: {name: null}, kz: {name: null}},

    // Старая информация предмета (для сравнения категорий)
    oldSubject: {ru: {name: null}, kz: {name: null}},

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
        ...subject,
        categories: (subject.categories || []).map(s => s.id),
      }
    },
    // Очистить
    clear() {
      this.subject = {ru: {name: null}, kz: {name: null}};
      this.oldSubject = {ru: {name: null}, kz: {name: null}};
    },
    // Закрыть себя (Модалку)
    closeSelf() {
      this.$modal.hide("edit-subject");
    },
    // Валидация информации категории
    async validate() {
      if (!this.subject.ru.name) {
        return false;
      }
      if (!this.subject.kz.name) {
        return false;
      }
      return true;
    },
    // Сохранить категорию
    async saveSubject() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewSubject) await this._createSubject(this.subject);
        else await this._updateSubject({newSubject: this.subject, oldSubject: this.oldSubject});
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
