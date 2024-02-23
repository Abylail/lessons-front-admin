<template>
  <div class="tsq page">
    <h2 class="tsq__title">Завки на подписку</h2>

    <div class="tsq__list">
      <v-card class="tsq__card" v-for="request in requests" :key="request.id">
        <v-card-title>{{ request.phone }} Тариф - {{ request.rate.name_ru }}</v-card-title>
        <v-card-subtitle>Дата создания: {{ request.createdAt | dateTimeFormat}}</v-card-subtitle>
        <v-card-actions>
          <v-select
            label="Статус"
            :value="request.status"
            :items="toySubscribeStatuses"
            item-value="code"
            item-text="name"
            dense outlined
            @input="updateStatus($event, request.id)"
          />
        </v-card-actions>

        <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Корзина <div> (<strong>{{ getTokensCount(request.cart) }}</strong>/100)</div></v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="tsq__toys">
              <div class="tsq__toy" v-for="toy in request.cart">
                <img class="tsq__toy-image" :src="getToyImageUrl(toy)"/>
                <div>{{ toy.name_ru }}</div>
                <div>{{ toy.token }} токенов</div>
                <button class="tsq__toy-kaspi" @click="goKaspi(toy)">Kaspi</button>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {toySubscribeStatuses} from "@/config/lists";

export default {
  name: "toysSubscribeRequest",
  data: () => ({
    isLoading: false,

    toySubscribeStatuses,
  }),
  computed: {
    ...mapGetters({
      requests: "admin/toysSubscribeRequest/getList",
    }),
  },
  methods: {
    ...mapActions({
      _fetchList: "admin/toysSubscribeRequest/fetchList",
      getToy: "admin/toys/getOne",
      _updateStatus: "admin/toysSubscribeRequest/updateStatus",
    }),

    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },

    getToyImageUrl(toy) {
      const url = toy.photos[0]
      return process.env.CDN_URL + url;
    },

    async goKaspi(toy) {
      const fullToy = await this.getToy(toy);
      if (!!fullToy?.kaspiUrl) window.open(fullToy?.kaspiUrl, "_blank")
    },

    getTokensCount(cart) {
      return (cart || []).reduce((sum, {token}) => sum+token, 0)
    },

    updateStatus(status, id) {
      this._updateStatus({id, status})
    }
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style lang="scss" scoped>
.tsq {

  &__title {
    margin-bottom: 20px;
  }

  &__card {
    margin-bottom: 20px;
  }

  &__toys {
    display: flex;
    flex-wrap: wrap;
  }

  &__toy {
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    border: 1px solid #d9d9d9;
    padding: 4px 8px;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  &__toy-image {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  &__toy-kaspi {
    border-radius: 5px;
    background-color: #e32626;
    color: white;
    padding: 2px 8px;
    font-size: 12px;
    line-height: 12px;
  }

}
</style>
