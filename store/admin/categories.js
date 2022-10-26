export const state = () => ({
  // Список учителей
  categoryList: [{ru: {name: "russ"}, kz: {name: "kazz"}}],
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
  async fetchCategoryList({ commit, rootGetters }) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$get(`/api/v1/admin/category/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["CategoryList", body]);
        }
      })
  },

  // Создать категорию
  async createCategory({ commit, rootGetters, dispatch  }, categoryInfo) {

    await this.$api.$post(`/api/v1/admin/category/add`, {
      ...categoryInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Категория создан");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Обновить информацию категории
  async updateCategory({ commit, rootGetters, dispatch  }, categoryInfo) {

    await this.$api.$put(`/api/v1/admin/category/update/${categoryInfo.id}`, {
      ...categoryInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Категория обновлена");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Удалить категорию
  async deleteCategory({ dispatch }, categoryInfo) {
    await this.$api.$delete(`/api/v1/admin/category/delete/${categoryInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Категория удалена");
          dispatch("fetchCategoryList");
        }
      })
  }
}
