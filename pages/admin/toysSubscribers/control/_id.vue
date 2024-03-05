<template>
  <div class="subscribe page">
    <h2 class="subscribe__title">
      <v-btn outlined small color="primary" @click="$router.push('/admin/toysSubscribers')">Назад к списку</v-btn>
      <span v-if="isNew">Создание подписки</span>
      <span v-else>Контроль подписки</span>

      <v-btn class="ml-10" color="primary" :loading="isLoading" @click="saveHandle()">Сохранить</v-btn>
      <v-btn v-if="!isNew" icon @click="deleteHandle()"><v-icon>mdi-delete</v-icon></v-btn>
    </h2>

    <div class="subscribe__form">

      <h3 class="mb-3">Личные данные</h3>

      <div class="relative-columns-3">
        <!-- phone -->
        <base-phone-input
          label="Телефон"
          v-model="subscribe.phone"
          ref="phoneInput"
          outlined dense
        />

        <v-text-field
          label="Имя (не видно для пользователя)"
          v-model="subscribe.name"
          outlined dense
        />

        <v-text-field
          label="Адрес"
          v-model="subscribe.address"
          outlined dense
        />

      </div>

      <h3 class="mb-3">Тариф</h3>

      <div class="relative-columns-3">
        <v-text-field
          label="Название тарифа"
          v-model="subscribe.rate"
          outlined dense
        />

        <v-text-field
          label="Сколько заплатил за тариф"
          type="number"
          v-model="subscribe.ratePrice"
          outlined dense
        />

        <v-text-field
          label="Колличество токенов"
          type="number"
          v-model="subscribe.tokens"
          outlined dense
        />
      </div>

      <div class="relative-columns-3">
        <v-text-field
          label="Откуда узнал"
          v-model="subscribe.fromRef"
          outlined dense
        />

        <v-text-field
          label="Скидка в процентах"
          type="number"
          v-model="subscribe.sale"
          :rules="[n => n <= 30 || 'Не более 30%']"
          outlined dense
        />

        <v-switch
          class="mt-1"
          label="Активна ли подписка"
          v-model="subscribe.active"
          dense hide-details
        />
      </div>

      <h3 class="mb-3">Даты подписки</h3>

      <div class="relative-columns-3">
        <v-text-field
          label="Начало подписки"
          type="date"
          :value="dateFormat(subscribe.startSubscription, 'yyyy-MM-DD')"
          outlined dense
          @input="d => subscribe.startSubscription = d"
        />
        <v-text-field
          label="Конец подписки"
          type="date"
          :value="dateFormat(subscribe.endSubscription, 'yyyy-MM-DD')"
          @input="d => subscribe.endSubscription = d"
          outlined dense
        />
      </div>

      <h3 class="mb-3">Товары</h3>

      <h3 class="mb-3">Для менеджера</h3>
      <div class="relative-columns-3">
        <v-text-field
          label="Статус по клиенту"
          v-model="subscribe.status"
          outlined dense
        />

        <v-text-field
          label="Коммент"
          v-model="subscribe.comment"
          outlined dense
        />
      </div>

    </div>
  </div>
</template>

<script>
import BasePhoneInput from "@/components/base/BasePhoneInput";
import {mapActions} from "vuex";
import {dateFormat} from "@/plugins/filters";

export default {
  components: {BasePhoneInput},
  data: () => ({
    subscribe: {active: true},

    isLoading: false,
  }),
  computed: {
    // id подписки
    subscribeId() {
      return this.$route.params.id;
    },

    // Новое ?
    isNew() {
      return !this.subscribeId;
    }
  },
  watch: {
    subscribeId: {
      handler(val) {
        if (val) this.fetchInfo(val);
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      _createSubscriber: "admin/toysSubscribers/createSubscriber",
      _updateSubscriber: "admin/toysSubscribers/updateSubscriber",
      _deleteSubscriber: "admin/toysSubscribers/deleteSubscriber",
      _fetchOne: "admin/toysSubscribers/fetchOne",
    }),

    dateFormat,

    // Сохранить
    async saveHandle() {
      this.isLoading = true;
      let updatedSubscribe = null;
      if (this.isNew) updatedSubscribe = await this._createSubscriber(this.subscribe);
      else updatedSubscribe = await this._updateSubscriber(this.subscribe);

      if (this.isNew && updatedSubscribe) {
        this.$router.push(`/admin/toysSubscribers/control/${updatedSubscribe.id}`)
        console.log(updatedSubscribe)
      }

      this.isLoading = false;
    },

    // Запросить данные
    async fetchInfo() {
      this.isLoading = true;
      const subscribe = await this._fetchOne(this.subscribeId);
      if (subscribe) this.subscribe = JSON.parse(JSON.stringify(subscribe));
      this.isLoading = false;
    },

    async deleteHandle() {
      if (confirm("Вы точно хотите удалить?")) {
        this.isLoading = true;
        await this._deleteSubscriber(this.subscribeId);
        this.isLoading = false;
        this.$router.push('/admin/toysSubscribers')
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.subscribe {

  &__form {
    margin-top: 24px;
  }

}
</style>
