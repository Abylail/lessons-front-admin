<template>
  <div class="promotions page">

    <h2 class="page__title">Список акций</h2>

    <div class="promotions__list">
      <div class="promotions__item" v-for="(item, index) in promotions" :key="index">
        <div class="promotions__item-title">{{ item.title }}</div>
        <div class="promotions__item-status">Статус: {{ item.status || "Не подан" }}</div>
        <div class="promotions__item-actions">
          <v-btn title="Редактировать" icon @click="editPromotionHandle(index)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn color="red" title="Удалить" icon><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </div>
      <div class="promotions__create promotions__item" @click="editPromotionHandle(null)">
        Создать акцию +
      </div>
    </div>

    <!-- Модалки -->
    <promotion-edit-modal :value="promotionsEdit" :show.sync="showPromotionsEdit" @input="editPromotion($event)"/>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import PromotionEditModal from "@/components/common/modal/promotionEditModal";

export default {
  name: "promotions",
  components: {PromotionEditModal},
  data: () => ({
    promotions: [],
    isLoading: false,

    showPromotionsEdit: false,
    promotionsEdit: null,
    promotionsEditIndex: null,
  }),
  computed: {
    ...mapGetters({
      _promotions: "user/getPromotions",
    }),
    canCreate() {
      return true;
    }
  },
  methods: {
    ...mapActions({
      _fetchPromotions: "user/fetchPromotions",
    }),
    async getPromotions() {
      this.isLoading = true;
      await this._fetchPromotions();
      this.promotions = JSON.parse(JSON.stringify(this._promotions));
      this.isLoading = false;
    },

    // Нажатие на кнопку создать или редактировать
    editPromotionHandle(index = null) {
      this.promotionsEditIndex = index;
      this.promotionsEdit = this.promotions[index] || {title: "", content: "", status: "Ожидает ответа"};
      this.showPromotionsEdit = true;
    },
    editPromotion(value) {
      if (this.promotionsEditIndex === null) this.promotions.push(null);
      this.promotionsEditIndex = this.promotions.length - 1;
      this.promotions[this.promotionsEditIndex] = value;
    },
  },
  mounted() {
    this.getPromotions();
  }
}
</script>

<style lang="scss" scoped>
.promotions {

  &__list {

  }

  &__item {
    display: grid;
    grid-template-columns: 1fr 1fr 100px;
    border: 1px solid #ccc;
    line-height: 20px;
    padding-left: 10px;
    &:not(:first-child) {border-top: transparent;}
    &:first-child {border-top-left-radius: 5px;border-top-right-radius: 5px;}
    &:last-child {border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;}
  }

  &__item-title {
    display: flex;
    align-items: center;
  }

  &__item-status {
    display: flex;
    align-items: center;
  }

  &__create {
    display: block;
    text-align: center;
    cursor: pointer;
    color: #1976d2;
    transition: .3s;
    user-select: none;
    line-height: 40px;
    &:hover {background: rgba(0, 0, 0, .05)}
    &:active {background: rgba(0, 0, 0, .1)}
  }

}
</style>
