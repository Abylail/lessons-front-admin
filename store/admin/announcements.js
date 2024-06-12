export const state = () => ({
  // Список обращений
  list: [],

  // Количество страниц
  lastStatus: "moderation",
})

export const getters = {
  // Список обращений
  getList: state => state.list,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Получить список обращений
  async fetchAppealList({ commit, state }, status = state.lastStatus) {
    commit("set", ["lastStatus", status])
    commit("set", ["list", []]);
    await this.$api.$get(`/api/v1/admin/announcement/get`, {params: {status}})
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["list", body]);
        }
      })
  },

  // Получить список обращений
  async updateAppeal({ commit, dispatch }, announcement) {
    await this.$api.$put(`/api/v1/admin/announcement/update/${announcement.id}`, announcement)
      .then(({err, body}) => {
        if (!err) {
          dispatch("fetchAppealList");
          this.$toast.success("Обновлено")
        }
      })
  },
}
