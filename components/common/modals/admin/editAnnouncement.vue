<template>
  <modal name="edit-announcement" size="small" :close-on-out-click="false" close-button @onShow="onShow()" @onHide="clear()">
    <div class="edit-announcement">
      <h2>Редактирование объявления</h2>

      <v-btn class="mt-5" block :loading="isLoading" color="primary" @click="saveHandle()">Сохранить</v-btn>

      <div class="edit-announcement__form mt-5">
        <v-select
          label="Статус объявления"
          v-model="announcement.status"
          :items="statuses"
          item-text="title"
          item-value="code"
          outlined dense
        />
        <v-text-field
          label="Название"
          v-model="announcement.title"
          outlined dense
        />
        <v-text-field
          label="Цена товара"
          v-model="announcement.price"
          type="number"
          outlined dense
        />
        <v-text-field
          label="Цена доставки"
          :value="announcement.delivery_price"
          type="number"
          outlined dense disabled
        />

        <div>
          Цена для пользователя
          <strong>цена товара + цена доставки</strong>
        </div>

        <div class="mb-5" v-if="announcement.status === 'waitingPayment' || announcement.status === 'ordered'">
          <div>Нужна дезинфекция: {{ announcement.need_disinfected ? "Да" : "Нет"  }}</div>
          <div>Экспресс доставка: {{ announcement.express_delivery ? "Да" : "Нет"  }}</div>
        </div>

        <div v-if="announcement.photos?.length" class="edit-announcement__images">
          <div
            class="edit-announcement__image"
            v-for="(photoPath, index) in announcement.photos" :key="index"
            :style="{backgroundImage: `url(${getImageUrl(photoPath)})`}"
          />
        </div>

        <v-text-field
          label="Состояние"
          v-model="announcement.condition"
          type="number"
          :rules="[n => (n <= 5 && n >= 1) || 'от 1 до 5']"
          outlined dense
        />

        <v-textarea
          label="Описание"
          v-model="announcement.description"
          outlined dense
        />
        <v-textarea
          label="Описание пользования"
          v-model="announcement.use_experience"
          outlined dense
        />
        <div class="columns-2">
          <v-text-field
            label="Минимальный возраст (в месяцах)"
            v-model="announcement.min_age"
            type="number"
            outlined dense
          />
          <v-text-field
            label="Максимальный возраст (в месяцах)"
            v-model="announcement.max_age"
            type="number"
            outlined dense
          />
        </div>
      </div>

      <div v-if="announcement.seller">
        <h3>Информация о продавце</h3>
        <div>{{ announcement.seller.last_name }} {{ announcement.seller.first_name }}</div>
        <div><a :href="`https://wa.me/${announcement.seller.phone}`">{{ announcement.seller.phone }}</a></div>
      </div>

      <div v-if="announcement.buyer">
        <h3>Информация о покупателе</h3>
        <div>{{ announcement.buyer.last_name }} {{ announcement.buyer.first_name }}</div>
        <div><a :href="`https://wa.me/${announcement.buyer.phone}`">{{ announcement.buyer.phone }}</a></div>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "editAnnouncement",
  data: () => ({
    announcement: {},

    //"draft", "moderation", "rejected", "active", "waitingPayment", "ordered", "archive"
    statuses: [
      {title: "На модерации", code: "moderation"},
      {title: "Отказ", code: "rejected"},
      {title: "Активен", code: "active"},
      {title: "Ожидает оплаты", code: "waitingPayment"},
      {title: "Ожидает доставки", code: "ordered"},
      {title: "В архиве", code: "archive"},
    ],

    isLoading: false
  }),
  methods: {
    ...mapActions({
      updateAppeal: "admin/announcements/updateAppeal"
    }),

    getImageUrl(url) {
      return process.env.CDN_URL + url;
    },

    onShow() {
      if (this.$modal.$payload && this.$modal.$payload.announcement) {
        this.announcement = {...this.$modal.$payload.announcement};
      }
    },

    clear() {
      this.announcement = {};
    },

    async saveHandle() {
      this.isLoading = true;
      await this.updateAppeal(this.announcement);
      this.isLoading = false;
      this.$modal.hide("edit-announcement");
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-announcement {
  padding-bottom: 32px;

  &__images {
    display: flex;
    flex-direction: row;
    overflow-y: auto;
    margin-bottom: 16px;
  }

  &__image {
    height: 100px;
    width: 100px;
    background-size: cover;
    background-position: center;
    margin-right: 16px;
  }

}
</style>
