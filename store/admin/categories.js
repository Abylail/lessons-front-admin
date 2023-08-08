export const state = () => ({
  // Список учителей
  categoryList: [],
})

export const getters = {
  // Список категорий
  getCategoryList: state => state.categoryList,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Получить список категорий
  async fetchCategoryList({ commit, state }, optimize = false) {
    if (optimize && state.categoryList.length) return;
    await this.$api.$get(`/api/v1/admin/category/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["categoryList", body]);
        }
      })
  },

  // Создать категорию
  async createCategory({ rootGetters, dispatch  }, categoryInfo) {
    await this.$api.$post(`/api/v1/admin/category/create`, categoryInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Категория создан");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Удалить категорию
  async deleteCategory({ dispatch }, categoryInfo) {
    await this.$api.$delete(`/api/v1/admin/category/delete/${categoryInfo.code}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Категория удалена");
          dispatch("fetchCategoryList");
        }
      })
  },
}
