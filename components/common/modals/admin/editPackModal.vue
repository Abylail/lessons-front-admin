<template>
  <modal name="edit-pack" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="edit-pack">
      <h2>Пакет</h2>
      <div class="edit-pack__form">
        <div class="relative-columns-2">
          <v-text-field label="Название (рус)" v-model="pack.name_ru" outlined dense/>
          <v-text-field label="Название (каз)" v-model="pack.name_kz" outlined dense/>
        </div>
        <div class="relative-columns-2">
          <v-text-field label="Описание (рус)" v-model="pack.description_ru" outlined dense/>
          <v-text-field label="Описание (каз)" v-model="pack.description_kz" outlined dense/>
        </div>
        <toys-control v-model="pack.list"/>
      </div>
      <div class="edit-pack__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn v-if="!isNew" color="error" outlined @click="deletePack()"><v-icon>mdi-delete</v-icon></v-btn>
        <v-btn color="primary" :loading="isLoading" @click="savePack()">Сохранить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";
import ToysControl from "@/components/common/toys/toysControl";

export default {
  name: "editPackModal",
  components: {ToysControl},
  data: () => ({
    pack: {},

    isLoading: false,
  }),
  computed: {
    isNew() {
      return !this.pack.id;
    }
  },
  methods: {
    ...mapActions({
      _createPack: "admin/toyPacks/createPack",
      _updatePack: "admin/toyPacks/updatePack",
      _deletePack: "admin/toyPacks/deletePack"
    }),

    getPayload() {
      if (this.$modal.$payload && this.$modal.$payload.pack) {
        this.pack = {...this.$modal.$payload.pack};
      }
      if (this.$modal.$payload && this.$modal.$payload.categoryId) {
        this.pack = {...this.pack, category_id: this.$modal.$payload.categoryId};
      }
    },

    async deletePack() {
      this.isLoading = true;
      if (confirm("Вы точно хотите удалить пакет?")) await this._deletePack(this.pack);
      this.isLoading = false;
      this.closeSelf();
    },

    clear() {
      this.pack = {};
    },

    async savePack() {
      this.isLoading = true;
      if (this.isNew) await this._createPack(this.pack);
      else await this._updatePack(this.pack);
      this.closeSelf();
      this.isLoading = false;
    },

    closeSelf() {
      this.$modal.hide('edit-pack')
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-pack {

  &__form {
    margin-top: 20px;
  }

}
</style>
