export const state = () => ({
  // Список обращений
  appealList: [],

  // Количество страниц
  pagesCount: null,
})

export const getters = {
  // Список обращений
  getAppealList: state => state.appealList,

  // Количество страниц
  getPagesCount: state => state.pagesCount,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Получить список обращений
  async fetchAppealList({ commit }, page=1) {
    await this.$api.$get(`/api/v1/appeal/get/${page}`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["appealList", body.appeals]);
          commit("set", ["pagesCount", body.page_count]);
        }
      })
  },

  // Ответить на обращение
  async answerAppeal({ dispatch }, appealInfo) {
    const {id, answer} = appealInfo;
    await this.$api.$post(`/api/v1/appeal/reply`, {
      appeal_id: id,
      answer
    })
      .then(async ({err, body}) => {
        if (!err) {
          this.$toast.success("Ответ отправлен!");
          await dispatch("fetchAppealList");
        }
      })
  },
}
