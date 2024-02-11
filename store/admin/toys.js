export const state = () => ({
  // Список игрушек
  toys: [],
})

export const getters = {
  // Список игрушек
  getToyList: state => state.toys,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Получить список игрушек
  async fetchToysList({ commit, state }) {
    await this.$api.$get(`/api/v1/admin/toy/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["toys", body]);
        }
      })
  },

  // Создать игрушки
  async createToy({ rootGetters, dispatch  }, toyInfo) {
    return new Promise(resolve => {
      this.$api.$post(`/api/v1/admin/toy/create`, toyInfo)
        .then(({err, body}) => {
          if (!err) {
            this.$toast.success("Игрушка создана");
            dispatch("fetchToysList");
          }
          resolve(!err);
        })
    })
  },

  // Создать игрушки
  async updateToy({ rootGetters, dispatch  }, toyInfo) {
    return new Promise(resolve => {
      this.$api.$put(`/api/v1/admin/toy/update/${toyInfo.id}`, toyInfo)
        .then(({err, body}) => {
          if (!err) {
            this.$toast.success("Игрушка обновлена");
            dispatch("fetchToysList");
          }
          resolve(!err);
        })
    })
  },

  // Удалить категорию
  async deleteToy({ dispatch }, toyInfo) {
    return new Promise(resolve => {
      this.$api.$delete(`/api/v1/admin/toy/delete/${toyInfo.id}`)
        .then(({err, body}) => {
          if (!err) {
            this.$toast("Игрушка удалена");
            dispatch("fetchToysList");
          }
          resolve(!err);
        })
    })
  },
}
