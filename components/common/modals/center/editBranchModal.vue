<template>
  <modal name="edit-branch" size="small" :close-on-out-click="false" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-branch">
      <h2>Филиал</h2>
      <div class="edit-branch__form">
        <v-text-field label="Адрес" v-model="branch.address" outlined dense/>
        <v-text-field label="Телефон" v-model="branch.phone" v-mask="'+7 (###) ###-##-##'" outlined hide-details dense/>
        <v-switch label="Есть whatsapp" color="green" v-model="branch.whatsapp" dense/>
        <v-text-field label="Ссылка 2гис" v-model="branch.two_gis" outlined dense/>
        <v-text-field label="Ссылка яндекс карты" v-model="branch.yandex" outlined dense/>
        <v-select label="Город" v-model="branch.city_id" :items="cities" :disabled="branch.city_name" item-value="id" item-text="ru.name" outlined dense/>
      </div>
      <div class="edit-branch__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="primary" :loading="isLoading" @click="saveBranch()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "editBranchModal",
  data: () => ({
    // Информация филиала
    branch: {},

    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      cities: "getCities",
    }),
    // Новый ли филиал (создание или апдейт)
    isNewBranch() {
      return !this.branch.id;
    },
  },
  methods: {
    ...mapActions({
      _createBranch: "center/branches/createBranch",
      _updateBranch: "center/branches/updateBranch",
      fetchCities: "fetchCities",
    }),

    // Получить вложения
    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.branch) {
        this.branch = {...this.$modal.$payload.branch};
      }
    },

    // Очистка информации
    clear() {
      this.branch = {};
    },

    // Закрыть себя (модалку)
    closeSelf() {
      this.$modal.hide("edit-branch");
    },

    // Валидация информации филиала
    async validate() {
      return true;
    },

    // Сохранить филиал
    async saveBranch() {
      this.isLoading = true;
      if (await this.validate()) {
        if (this.isNewBranch) await this._createBranch(this.branch);
        else await this._updateBranch(this.branch);
        this.closeSelf();
      }
      this.isLoading = false;
    }
  },
  mounted() {
    this.fetchCities();
  }
}
</script>

<style lang="scss" scoped>
.edit-branch {

  &__form {
    margin-top: 20px;
  }

  &__actions {
    text-align: right;
  }

}
</style>
