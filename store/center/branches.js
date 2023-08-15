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
    await this.$api.$get(`/api/v1/admin/institution/${centerId}/branch/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["branchList", body]);
        }
      })
  },

  // Создать филиал
  async createBranch({ commit, rootGetters, dispatch  }, branchInfo) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$post(`/api/v1/admin/institution/${centerId}/branch/create`, branchInfo)
      .then(async ({err, body}) => {
        if (!err) {
          this.$toast.success("Филиал создан");
          await dispatch("fetchBranchList");
        }
      })
  },

  // Создать филиал
  async updateBranch({ commit, rootGetters, dispatch  }, branchInfo) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$put(`/api/v1/admin/institution/${centerId}/branch/update/${branchInfo.id}`, branchInfo)
      .then(async ({err, body}) => {
        if (!err) {
          this.$toast.success("Филиал создан");
          await dispatch("fetchBranchList");
        }
      })
  },

  // Удалить филиал
  async deleteBranch({ dispatch, rootGetters }, branchInfo) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$delete(`/api/v1/admin/institution/${centerId}/branch/delete/${branchInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Филиал удален");
          dispatch("fetchBranchList");
        }
      })
  },
}
