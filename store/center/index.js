
export const state = () => ({

  // Информация центра
  centerInfo: null,
})

export const getters = {
  getCenterInfo: state => state.centerInfo,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Получить информацию центра
  async fetchCenterInfo({ commit, rootGetters }) {
    const { center_id } = rootGetters["auth/getUserInfo"];
    if (!center_id) return;
    await this.$api.$get(`/api/v1/center/get/${center_id}`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["centerInfo", body]);
        }
      })
  },

  // Сохранить информацию центра
  async saveCenterInfo({ commit, rootGetters }, centerInfo) {
    const token = rootGetters["auth/getUserToken"];
    await this.$api.$post(`/api/v1/center/update`, {
      session_token: token,
      ...centerInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Информация центра сохранена");
        }
      })
  },
}
