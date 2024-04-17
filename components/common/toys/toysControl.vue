<template>
  <div class="toys-control">
    <div class="toys-control__box">
      <div class="toys-control__selected-list" v-if="selectedToys">
        <div class="toys-control__toy" v-for="toy in selectedToys" :key="toy.id">
          <img class="toys-control__toy-image" :src="getToyImageUrl(toy)"/>
          <div class="toys-control__toy-text">{{ toy.name_ru }} ({{ toy.token }}т)</div>
        </div>
      </div>
      <v-btn small outlined @click="setShowModal(true)">Редактировать</v-btn>
    </div>

      <div class="toys-control__modal" v-if="showModal" @click="setShowModal(false)">
        <div class="toys-control__modal-window" @click.stop>
          <v-text-field label="Поиск по названию" v-model="searchText" outlined dense clearable/>
          <div class="toys-control__modal-search">

          <div class="toys-control__selected-list" v-if="selectedToys && selectedToys.length">
            <h4 class="mb-3">Выбранные игрушки</h4>
            <div class="toys-control__toy" v-for="toy in selectedToys" :key="toy.id">
              <img class="toys-control__toy-image" :src="getToyImageUrl(toy)"/>
              <div class="toys-control__toy-text">{{ toy.name_ru }} ({{ toy.token }}т)</div>
              <v-btn icon @click="removeToy(toy)"><v-icon color="primary">mdi-minus</v-icon></v-btn>
            </div>
          </div>

            <v-divider class="mt-5 mb-5" v-if="selectedToys && selectedToys.length"/>

          <div class="toys-control__list">
            <div class="toys-control__toy" v-for="toy in toys" :key="toy.id">
              <img class="toys-control__toy-image" :src="getToyImageUrl(toy)"/>
              <div class="toys-control__toy-text">{{ toy.name_ru }}</div>
              <v-btn icon @click="addToy(toy)"><v-icon color="primary">mdi-plus</v-icon></v-btn>
            </div>
          </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {getToken} from "@/helpers/methods";

export default {
  name: "toysControl",
  props: {
    value: {
      type: String,
      default: "[]"
    }
  },
  data: () => ({
    showModal: false,
    searchText: "",
  }),
  computed: {
    ...mapGetters({
      _toys: "admin/toys/getToyList",
    }),

    // Список игрушек
    toys() {
      let toys = this._toys.slice();
      if (this.searchText) {
        const lowerSearch = this.searchText?.toLowerCase();
        toys =  toys.filter(({name_ru}) => name_ru?.toLowerCase().includes(lowerSearch));
      }
      return toys.filter(toy => !this.isSelected(toy))
    },

    selectedToys: {
      get() {
        return JSON.parse(this.value) || [];
      },
      set(val) {
        this.$emit("input", JSON.stringify(val))
      }
    }
  },
  methods: {
    ...mapActions({
      fetchToys: "admin/toys/fetchToysList",
    }),

    setShowModal(show) {
      this.showModal = show;
      if (!show) this.searchText = "";
    },

    getToyImageUrl(toy) {
      const url = toy.photos[0]
      return process.env.CDN_URL + url;
    },

    isSelected(toy) {
      return !!this.selectedToys.find(t => t.id === toy.id);
    },

    addToy(toy) {
      // "id", "name_ru", "name_kz", "photos", "token"
      this.selectedToys = [...this.selectedToys, {
        id: toy.id,
        name_ru: toy.name_ru,
        name_kz: toy.name_kz,
        photos: toy.photos,
        token: getToken(toy),
      }]
    },

    removeToy(toy) {
      let newList = this.selectedToys.slice();
      const removeIndex = newList.findIndex(t => t.id === toy.id);
      newList.splice(removeIndex, 1);
      this.selectedToys = newList;
    }
  },
  mounted() {
    this.fetchToys();
  }
}
</script>

<style lang="scss" scoped>
.toys-control {

  &__box {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    margin-bottom: 16px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  &__selected-list {
    display: flex;
    flex-direction: column;
  }

  &__toy {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 5px;
    border: 1px solid #d9d9d9;
    padding: 4px 8px;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  &__toy-text {
    flex: 1;
  }

  &__toy-image {
    width: 50px;
    height: 50px;
    object-fit: contain;
    margin-right: 5px;
  }

  &__modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: rgba(0, 0, 0, .3);
  }

  &__modal-window {
    min-width: 50%;
    max-width: 90%;
    max-height: 90%;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    overflow: hidden;
  }

  &__modal-search {
    overflow: auto;
    max-height: 70vh;
  }

}
</style>
