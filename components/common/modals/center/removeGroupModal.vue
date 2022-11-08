<template>
  <modal name="remove-group" size="small" close-button @onShow="getPayload()" @onHide="clear()">
    <div class="remove-group">
      <div class="remove-group__text">Вы уверены что хотите удалить группу?</div>

      <div class="remove-group__info" v-if="group">
        <div class="remove-group__info-title">Дни:</div>
        <div class="remove-group__info-value">{{ days }}</div>
      </div>

      <div class="remove-group__info" v-if="group">
        <div class="remove-group__info-title">Учитель:</div>
        <div class="remove-group__info-value">{{ group.teacher_full_name }}</div>
      </div>

      <div class="remove-group__info" v-if="group">
        <div class="remove-group__info-title">Адрес(филиал):</div>
        <div class="remove-group__info-value">{{ group.branch_address }}</div>
      </div>

      <div class="remove-group__info" v-if="group">
        <div class="remove-group__info-title">Предмет:</div>
        <div class="remove-group__info-value">{{ group.center_subject_name }}</div>
      </div>

      <div class="remove-group__actions">
        <v-btn @click="closeSelf()">Отменить</v-btn>
        <v-btn class="ml-3" color="red" dark :loading="isLoading" @click="deleteHandle()">Удалить</v-btn>
      </div>
    </div>
  </modal>
</template>

<script>
import {mapActions} from "vuex";
import {weekdaysDictionary} from "@/config/lists";

export default {
  name: "removeGroupModal",
  data: () => ({
    // Информация группы
    group: null,

    isLoading: false,
  }),
  computed: {
    days() {
      if (!this.group || !this.group.days) return "";
      return this.group.days.map(({code, start, end}) => `${weekdaysDictionary[code]}(${start} - ${end})`).join(",");
    }
  },
  methods: {
    ...mapActions({
      _deleteGroup: "center/timetable/deleteGroup",
    }),

    // Закрыть себя
    closeSelf() {
      this.$modal.hide("remove-group");
    },

    // Получить вложения
    getPayload() {
      if (this.$modal.$payload?.group) {
        this.group = this.$modal.$payload?.group;
      }
    },

    // Удалить (кнопка)
    async deleteHandle() {
      this.isLoading = true;
      await this._deleteGroup(this.group.id);
      this.closeSelf();
      this.isLoading = false;
    },

    // Очистить
    clear() {
      this.group = null;
    },
  }
}
</script>

<style lang="scss" scoped>
.remove-group {
  padding-top: 10px;

  &__text {
    width: calc(100% - 80px);
    height: 50px;
    max-width: 350px;
    font-weight: bold;
    font-size: 18px;
    line-height: 20px;
  }

  &__actions {
    margin-top: 20px;
    text-align: right;
  }

  &__info {
    display: flex;
    flex-direction: row;
    font-size: 16px;
    line-height: 18px;
    margin: 10px 0;
    @media (max-width: $break-point) {flex-direction: column;}
  }

  &__info-title {
    width: 120px;
  }

  &__info-value {
    margin-left: 10px;
    font-weight: bold;
  }

}
</style>
