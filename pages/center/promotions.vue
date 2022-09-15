<template>
  <div class="promotions page">

    <h2 class="page__title">Список акций</h2>

    <!-- Список акций -->
    <div class="promotions__list">
      <div class="promotions__item" v-for="(promotion, index) in promotions" :key="index">
        <v-text-field v-model="promotion.title" label="Оглавление" outlined/>
        <vue-editor v-model="promotion.content"/>
      </div>
    </div>

    <!-- Создать акцию -->
    <v-btn
      class="promotions__create"
      v-show="canCreate" block outlined x-large
      @click="createPromotionHandle()"
    ><v-icon>mdi-plus</v-icon>Создать акцию</v-btn>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "promotions",
  data: () => ({
    promotions: [],
    isLoading: false,
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
    createPromotionHandle() {
      this.promotions.push({
        content: "", // html
        title: "", // title
      });
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
    padding: 20px 0 40px;
    margin: 20px 0;
    &:not(:last-child) {border-bottom: 1px solid black}
  }

}
</style>
