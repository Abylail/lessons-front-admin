export const state = () => ({
  // Список филиалов
  branchList: [],
})

export const getters = {
  // Список филиалов
  getBranchList: state => state.branchList,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Получить список филиалов
  async fetchBranchList({ commit, rootGetters }) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$get(`/api/v1/center/branch/get/${centerId}`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["branchList", body]);
        }
      })
  },

  // Создать филиал
  async createBranch({ commit, rootGetters, dispatch  }, branchInfo) {
    const centerId = rootGetters["auth/getCenterId"];
    await this.$api.$post(`/api/v1/center/branch/add`, {
      center_id: centerId,
      ...branchInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Филиал создан");
          dispatch("fetchBranchList");
        }
      })
  },

  // Создать филиал
  async updateBranch({ commit, rootGetters, dispatch  }, branchInfo) {
    const centerId = rootGetters["auth/getCenterId"];
    await this.$api.$put(`/api/v1/center/branch/update/${branchInfo.id}`, {
      center_id: centerId,
      ...branchInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Филиал создан");
          dispatch("fetchBranchList");
        }
      })
  },

  // Удалить филиал
  async deleteBranch({ dispatch }, branchInfo) {
    await this.$api.$delete(`/api/v1/center/branch/delete/${branchInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Филиал удален");
          dispatch("fetchBranchList");
        }
      })
  },
}
