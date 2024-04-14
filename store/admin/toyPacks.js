export const state = () => ({
  // Список категорий и пакетов
  list: null,
})

export const getters = {
  // Список категорий и пакетов
  getList: state => state.list || [],
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Получить список категорий и пакетов
  async fetchCategoryList({ commit, state }, optimize = false) {
    if (optimize && state.categoryList.length) return;
    await this.$api.$get(`/api/v1/admin/toyPacks/categories`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["list", body]);
        }
      })
  },

  // Создать категорию
  async createCategory({ rootGetters, dispatch  }, categoryInfo) {
    await this.$api.$post(`/api/v1/admin/toyPacks/categories`, categoryInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Категория создана");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Создать категорию
  async updateCategory({ rootGetters, dispatch  }, categoryInfo) {
    await this.$api.$put(`/api/v1/admin/toyPacks/categories/${categoryInfo.id}`, categoryInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Категория обновленна");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Удалить категорию
  async deleteCategory({ dispatch }, categoryInfo) {
    await this.$api.$delete(`/api/v1/admin/toyPacks/categories/${categoryInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Категория удалена");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Создать пакет
  async createPack({ rootGetters, dispatch  }, packInfo) {
    await this.$api.$post(`/api/v1/admin/toyPacks/pack`, packInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Пакет создан");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Создать пакет
  async updatePack({ rootGetters, dispatch  }, packInfo) {
    await this.$api.$put(`/api/v1/admin/toyPacks/pack/${packInfo.id}`, packInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Пакет обновлен");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Удалить пакет
  async deletePack({ dispatch }, packInfo) {
    await this.$api.$delete(`/api/v1/admin/toyPacks/pack/${packInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Пакет удален");
          dispatch("fetchCategoryList");
        }
      })
  },
}
