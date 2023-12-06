export const state = () => ({
  list: []
})

export const getters = {
  getList: state => state.list
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  async fetchList({ commit }) {
    await this.$api.$get(`/api/v1/admin/requests/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["list", body.reverse()]);
        }
      })
  },

  updateRequest({ dispatch }, {id, status, managerComment}) {
    return new Promise(resolve => {
      this.$api.$put(`/api/v1/admin/requests/update/${id}`, {status, managerComment})
        .then(async ({err, body}) => {
          if (!err) {
            await dispatch("fetchList")
            this.$toast.success("Обращение обновлено");
          }
          resolve(!err);
        })
    })
  },

  // Удалить обращение
  async deleteRequest({ dispatch }, {id}) {
    await this.$api.$delete(`/api/v1/admin/requests/delete/${id}`)
      .then(async ({err, body}) => {
        if (!err) {
          await dispatch("fetchList")
          this.$toast("Обращение удалено");
        }
      })
  }
}
