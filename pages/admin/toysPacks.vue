<template>
  <div class="toys-packs page">
    <h2 class="toys-packs__title">Пакеты</h2>

    <v-card class="toys-packs__category" v-for="category in categoryPack" :key="category.id">
      <v-card-title>{{ category.name_ru }} <v-btn icon small @click="$modal.show('edit-category-pack', {category})"><v-icon small>mdi-pencil</v-icon></v-btn></v-card-title>
      <v-card-subtitle>{{ category.description_ru }}</v-card-subtitle>

      <v-card-text>
        <div class="toys-packs__packs">
          <div class="toys-packs__pack" v-for="pack in category.toyPacks" :key="pack.id">
            <div class="toys-packs__pack-title">
              {{ pack.name_ru }}
              <v-btn small icon @click="$modal.show('edit-pack', {pack, categoryId: category.id})"><v-icon small>mdi-pencil</v-icon></v-btn>
            </div>
            <div class="toys-packs__pack-list">
              <div class="toys-packs__pack-head" v-for="item in getList(pack.list)" :key="item.id">
                <img class="toys-packs__pack-image" :src="getToyImageUrl(item)"/>
                <div class="toys-packs__pack-name">{{ item.name_ru }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" small outlined @click="$modal.show('edit-pack', {categoryId: category.id})">Добавить пакет+</v-btn>
      </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title>
        <v-btn color="primary" outlined block @click="$modal.show('edit-category-pack')">+ категория</v-btn>
      </v-card-title>
    </v-card>

    <edit-category-pack/>
    <edit-pack-modal/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import EditCategoryPack from "@/components/common/modals/admin/editCategoryPackModal";
import EditPackModal from "@/components/common/modals/admin/editPackModal";

export default {
  name: "toysPacks",
  components: {EditPackModal, EditCategoryPack},
  data: () => ({
    isLoading: false,
  }),
  computed: {
    ...mapGetters({
      categoryPack: "admin/toyPacks/getList"
    })
  },
  methods: {
    ...mapActions({
      _fetchCategoryList: "admin/toyPacks/fetchCategoryList"
    }),

    getList(listJson) {
      try {
        return JSON.parse(listJson) || [];
      } catch (e) {
        return [];
      }
    },

    getToyImageUrl(item) {
      const url = item.photos[0]
      return process.env.CDN_URL + url;
    },

    async fetchCategoryList() {
      this.isLoading = true;
      await this._fetchCategoryList();
      this.isLoading = false;
    }
  },
  mounted() {
    this.fetchCategoryList();
  }
}
</script>

<style lang="scss" scoped>
.toys-packs {

  &__title {
    margin-bottom: 20px;
  }

  &__category {
    margin: 16px 0;
  }

  &__packs {
    display: flex;
    flex-direction: row;
    overflow-y: auto;
  }

  &__pack {
    padding: 4px 8px;
    margin: 3px 6px;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.12);;
  }

  &__pack-head {
    display: grid;
    align-items: center;
    grid-template-columns: 40px 100px;
    column-gap: 4px;
    width: 150px;
    * {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  &__pack-image {
    width: 40px;
    min-width: 40px;
    height: 40px;
  }
}
</style>
