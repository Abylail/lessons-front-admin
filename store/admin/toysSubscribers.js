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
    await this.$api.$get(`/api/v1/admin/toySubscriber/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["list", body]);
        }
      })
  },

  // Получить список заявок
  async fetchOne({ commit }, subscribeId) {
    return new Promise(resolve => {
      this.$api.$get(`/api/v1/admin/toySubscriber/get/${subscribeId}`)
        .then(({err, body}) => {
          if (!err) return resolve(body);
          return resolve(null);
        })
    });
  },

  createSubscriber({ dispatch }, info) {
    return new Promise(resolve => {
      this.$api.$post(`/api/v1/admin/toySubscriber/create`, info)
        .then(({err, body}) => {
          if (!err) {
            this.$toast.success("Подписчик создан");
            dispatch("fetchList");
            return resolve(body);
          }
          resolve(null);
        })
    })
  },

  updateSubscriber({ dispatch }, info) {
    return new Promise(resolve => {
      this.$api.$put(`/api/v1/admin/toySubscriber/update/${info.id}`, info)
        .then(({err, body}) => {
          if (!err) {
            this.$toast.success("Подписчик обновлена");
            dispatch("fetchList");
            return resolve(body);
          }
          resolve(null);
        })
    })
  },

  deleteSubscriber({ dispatch }, subscribeId) {
    this.$api.$delete(`/api/v1/admin/toySubscriber/delete/${subscribeId}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Подписка удаленна");
          dispatch("fetchList");
        }
      })
  },
}
