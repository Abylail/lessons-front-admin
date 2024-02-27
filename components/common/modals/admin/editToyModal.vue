<template>
  <modal name="edit-toy" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-toy">
      <h2 v-if="isNew">Создание игрушки</h2>
      <h2 v-else>Обновление игрушки</h2>
      <div class="edit-toy__form">
        <div class="columns-2">
          <v-text-field
            label="Имя (рус)"
            v-model="toy.name_ru"
            outlined dense
          />
          <v-text-field
            label="Имя (каз)"
            v-model="toy.name_kz"
            outlined dense
          />
        </div>
        <div class="columns-2">
          <v-textarea
            label="Описание (рус)"
            v-model="toy.description_ru"
            outlined dense
          />
          <v-textarea
            label="Описание (каз)"
            v-model="toy.description_kz"
            outlined dense
          />
        </div>
        <div class="columns-2">
          <v-text-field
            label="Минимальный возраст (в месяцах)"
            v-model="toy.min_age"
            type="number"
            default="0"
            outlined dense
          />
          <v-text-field
            label="Максимальный возраст (в месяцах)"
            v-model="toy.max_age"
            type="number"
            default="8"
            outlined dense
          />
        </div>
        <div class="columns-2">
          <v-text-field
            label="Ссылка на Kaspi"
            v-model="toy.kaspiUrl"
            outlined dense
          />
          <v-text-field
            label="Цена в магазине"
            v-model="toy.price"
            type="number"
            outlined dense
          />
        </div>
        <div class="columns-2">
          <v-text-field
            label="Срок службы (мес)"
            v-model="toy.life_time"
            type="number"
            outlined dense
          />
          <v-select
            label="Категории"
            item-value="id"
            item-text="name_ru"
            v-model="toy.categories"
            :items="categories"
            :disabled="isNew"
            multiple outlined dense return-object
          />
        </div>
        <div class="columns-2">
          <v-text-field
            label="Размер (рус)"
            v-model="toy.size_ru"
            outlined dense
          />
          <v-text-field
            label="Размер (каз)"
            v-model="toy.size_kz"
            outlined dense
          />
        </div>
        <div class="columns-2">
          <v-text-field
            label="Материал (рус)"
            v-model="toy.material_ru"
            outlined dense
          />
          <v-text-field
            label="Материал (каз)"
            v-model="toy.material_kz"
            outlined dense
          />
        </div>
        <div class="columns-2">
          <v-text-field
            label="Предназначение (рус)"
            v-model="toy.purpose_ru"
            outlined dense
          />
          <v-text-field
            label="Предназначение (каз)"
            v-model="toy.purpose_kz"
            outlined dense
          />
        </div>
      </div>
      <div class="edit-toy__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveToy()">Сохранить</v-btn>
        <v-btn v-if="!isNew" icon @click="deleteHandle()"><v-icon color="red">mdi-delete</v-icon></v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BasePhoneInput from "@/components/base/BasePhoneInput";

const toyDefault = {
  min_age: 0,
  max_age: 96,
  life_time: 12,
}
export default {
  name: "editToyModal",
  components: {BasePhoneInput},
  data: () => ({
    toy: JSON.parse(JSON.stringify(toyDefault)),

    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      categories: "admin/toysCategories/getCategoryList"
    }),
    // Новое
    isNew() {
      return !this.toy.id
    }
  },
  methods: {
    ...mapActions({
      _createToy: "admin/toys/createToy",
      _updateToy: "admin/toys/updateToy",
      _deleteToy: "admin/toys/deleteToy",
    }),

    // Получить данные
    getPayload() {
      this.toy = JSON.parse(JSON.stringify(this.$modal.$payload?.toy || toyDefault));
    },

    // Закрыть себя
    closeSelf() {
      this.$modal.hide("edit-toy");
    },

    validate() {
      if (!this.toy.name_ru || !this.toy.name_kz) {
        this.$toast("Введите имя")
        return false;
      }

      if (!this.toy.description_ru || !this.toy.description_kz) {
        this.$toast("Введите описание")
        return false;
      }

      if (!this.toy.price) {
        this.$toast("Введите цену")
        return false;
      }

      if (!this.toy.kaspiUrl) {
        this.$toast("Введите ссылку kaspi")
        return false;
      }

      if (!this.toy.life_time) {
        this.$toast("Введите срок службы")
        return false;
      }

      if (!this.toy.max_age) {
        this.$toast("Введите максимальный возраст")
        return false;
      }

      return true;
    },

    // Очистить
    clear() {
      this.toy = {};
    },

    // Сохранить
    async saveToy() {
      this.isLoading = true;
      let success = false;
      if (this.validate()) {
        if (this.isNew) success = await this._createToy(this.toy);
        else success = await this._updateToy(this.toy);
      }
      if (success) this.closeSelf()
      this.isLoading = false;
    },

    // Удалить
    async deleteHandle() {
      if (confirm("Точно хотите удалить?")) {
        await this._deleteToy(this.toy);
        this.closeSelf();
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.edit-toy {

  &__form {
    margin-top: 20px;
  }

}
</style>
