export const state = () => ({
  // Список заявок
  list: [],
})

export const getters = {
  // Список заявок
  getList: state => state.list,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Получить список заявок
  async fetchList({ commit }) {
    await this.$api.$get(`/api/v1/admin/toySubscribeRequest/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["list", body]);
        }
      })
  },

  updateStatus({ dispatch }, {id, status}) {
    this.$api.$put(`/api/v1/admin/toySubscribeRequest/updateStatus/${id}`, {status})
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Статус обновлена");
          dispatch("fetchList");
        }
      })
  },
}
