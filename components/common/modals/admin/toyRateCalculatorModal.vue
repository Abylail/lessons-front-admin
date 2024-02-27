<template>
  <modal name="toy-rate-calculator" size="small" close-button>
    <div class="trc">
      <h2>Калькулятор по тарифу</h2>

      <div class="trc__form">
        <v-text-field
          label="Колличество токенов"
          v-model="tokenCount"
          type="number"
          outlined dense
        />
        <v-select
          label="Тариф"
          v-model="rate"
          :items="toyRates"
          item-text="name_ru"
          item-value="price"
          return-object outlined dense
        />
        <v-text-field
          label="Процент скидки"
          v-model="sale"
          type="number"
          :rules="[n => n <= 30 || 'Не более 30%']"
          :default="0"
          outlined dense
        />
      </div>

      <div class="trc__overall">
        <div class="trc__info">
          <strong>Цена:</strong>
          <span>
            <span v-if="rate">{{ rate.price_monthly }}тг/{{durationUnit}}</span>
            <span v-if="ratePrice">со скидкой <strong>{{ ratePrice }}тг/{{durationUnit}}</strong></span>
          </span>
        </div>
        <div class="trc__info">
          <strong>Длительность:</strong>
          <span v-if="rate">{{ rate.duration < 1 ? rate.duration*4 : rate.duration }} {{durationUnit}}</span>
        </div>
        <div v-if="extraTokens" class="trc__info">
          <strong>Дополнительные токены ({{ extraTokens }}):</strong>
          <span>{{ extraPrice }}тг/{{durationUnit}}</span>
        </div>
        <div class="mt-4 trc__info">
          <strong>К оплате:</strong>
          <span v-if="rate && tokenCount">{{ price }}тг</span>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import toyRates from "@/config/toyRates";
export default {
  name: "toyRateCalculatorModal",
  data: () => ({
    tokenCount: null,
    rate: null,
    sale: null,

    toyRates,
  }),
  computed: {

    ratePrice() {
      if (!this.rate || !this.sale || this.sale > 30) return null;
      return parseInt(this.rate?.price_monthly * (100 - this.sale)/100).toLocaleString();
    },

    extraTokens() {
      return this.tokenCount > 100 ? this.tokenCount - 100 : 0;
    },

    extraPrice(){
      const monthlyExtraPrice = this.extraTokens ? this.extraTokens*120 : 0
      if (this.rate && this.rate.duration < 1) return monthlyExtraPrice * this.rate.duration;
      else return monthlyExtraPrice
    },

    durationUnit() {
      return !this.rate || this.rate.duration <1 ? "нед" : "мес"
    },

    price() {
      let price = this.rate.price;
      if (this.sale && this.sale < 30) price =  price * ((100 - this.sale)/100)
      if (this.extraPrice) price += (this.extraPrice*this.rate.duration)
      return parseInt(price).toLocaleString()
    }
  }
}
</script>

<style lang="scss" scoped>
.trc {

  &__form {
    margin-top: 20px;
  }

  &__overall {
    border-top: 1px solid gray;
    padding-top: 20px;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
  }
}
</style>
