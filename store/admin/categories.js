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
    await this.$api.$get(`/api/v1/subject/category/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["categoryList", body]);
        }
      })
  },

  // Создать категорию
  async createCategory({ rootGetters, dispatch  }, categoryInfo) {
    await this.$api.$post(`/api/v1/subject/category/add`, categoryInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Категория создан");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Обновить информацию категории
  async updateCategory({ rootGetters, dispatch  }, categoryInfo) {
    await this.$api.$put(`/api/v1/subject/category/update/${categoryInfo.id}`, categoryInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Категория обновлена");
          dispatch("fetchCategoryList");
        }
      })
  },

  // Удалить категорию
  async deleteCategory({ dispatch }, categoryInfo) {
    await this.$api.$delete(`/api/v1/subject/category/delete/${categoryInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Категория удалена");
          dispatch("fetchCategoryList");
        }
      })
  },
}
