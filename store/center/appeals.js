export const state = () => ({
  // Список обращений
  appealList: null,
})

export const getters = {
  // Список обращений
  getAppealList: state => state.appealList || [],
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Получить список обращений
  async fetchAppealList({ rootGetters, commit }) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$get(`/api/v1/appeal/get`, {params: {center_id: centerId}})
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["appealList", body]);
        }
      })
  },

  // Отправить обращения
  async sendAppeal({ rootGetters, dispatch }, form = {title: "", question: ""}) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$post(`/api/v1/appeal/ask`, {...form, center_id: centerId})
      .then(async ({err, body}) => {
        if (!err) {
          await dispatch("fetchAppealList");
        }
      })
  },
}
