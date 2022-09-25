<template>
  <div class="settings page">

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import { activeCities } from "@/config/lists";
import WorkSchedule from "@/components/common/workSchedule";

export default {
  name: "settings",
  components: {WorkSchedule},
  data: () => ({
    isLoading: false,

    // Список городов
    activeCities,
  }),
}
</script>

<style lang="scss" scoped>
.settings {

  &__address {
    display: grid;
    grid-template-columns: 1fr 3fr 3fr 1fr;
    grid-column-gap: 20px;

    @media (max-width: $break-point) {
      display: block;
      margin-bottom: 30px;
    }
  }

  &__address-num {
    min-height: 56px;
    padding-top: 15px;
    font-weight: bold;
  }

  &__address-add {
    min-height: 40px;
    margin-bottom: 30px;
  }

  &__address-remove {
    @media (min-width: $break-point) {min-height: 40px}
  }

  &__actions {
    margin-top: 40px;
  }

  &__list {
    border: 1px solid $color--light-gray;
    width: 100%;
    max-width: 300px;
  }

  &__list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    &:not(:last-child) {
      border-bottom: 1px solid $color--light-gray;
    }
  }

  &__list-item-create {
    display: block;
    text-align: center;
    color: $color--blue;
    cursor: pointer;
  }

}
</style>
