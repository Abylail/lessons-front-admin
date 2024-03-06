<template>
  <div class="ts page">
    <h2 class="tsq__title">
      <span>Подписчики</span>
      <v-btn outlined small color="primary" @click="$router.push('/admin/toysSubscribers/control')">Создать подписку</v-btn>
    </h2>

    <div class="ts__list">
      <v-card class="mb-5 mt-5" :flat="daysLeft(subscriber.endSubscription) < 0" v-for="subscriber in subscribers" :key="subscriber.id" @click="$router.push(`/admin/toysSubscribers/control/${subscriber.id}`)">
        <v-card-title>
          <a :href="`https://wa.me/${subscriber.phone}`" @click.stop>{{ subscriber.phone }}</a>. ({{ subscriber.name }}) - {{ subscriber.rate }}
          <v-chip outlined class="ml-5" small v-if="subscriber.status">{{ subscriber.status }}</v-chip>
        </v-card-title>
        <v-card-subtitle v-if="daysLeft(subscriber.endSubscription) >= 0">
          Осталось дней <strong>{{ daysLeft(subscriber.endSubscription) }}</strong>
        </v-card-subtitle>
        <v-card-subtitle v-else>
          Подписка истекла
        </v-card-subtitle>
        <v-card-text>
          <div><strong>Адрес </strong>{{ subscriber.address || 'Не указан' }}</div>
          <div><strong>Начало </strong>{{ subscriber.startSubscription | dateTimeToText }}</div>
          <div><strong>Конец </strong>{{ subscriber.endSubscription | dateTimeToText }}</div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {daysLeft} from "@/helpers/methods";

export default {
  name: "toysSubscribers",
  data: () => ({
    isLoading: false
  }),
  computed: {
    ...mapGetters({
      subscribers: "admin/toysSubscribers/getList"
    })
  },
  methods: {
    ...mapActions({
      _fetchList: "admin/toysSubscribers/fetchList"
    }),

    daysLeft,

    async fetchList() {
      this.isLoading = true;
      await this._fetchList();
      this.isLoading = false;
    },
  },
  mounted() {
    this.fetchList();
  }
}
</script>

<style scoped>

</style>
