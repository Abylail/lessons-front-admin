export const state = () => ({
  // Список обращений
  appealList: null,
})

export const getters = {
  // Список обращений
  getAppealList: state => state.appealList || [],

  // Колличество обращений на который ответили но не прочитан
  getNewAnsweredCount: state => state.appealList?.filter(a => a.answer && !a.center_read).length,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  },
  // "Прочитать" обращение
  setRead(state, appealId) {
    let newAppealList = state.appealList.slice();
    let appealIndex = newAppealList.findIndex(a => a.id === appealId);
    newAppealList[appealIndex] = {...newAppealList[appealIndex], center_read: true};
    state.appealList = newAppealList;
  }
}

export const actions = {

  // Получить список обращений
  async fetchAppealList({ rootGetters, commit }) {
    return;
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$get(`/api/v1/appeal/center/get`, {params: {center_id: centerId}})
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

  // Поментить обращение как прочитанное
  async readAppeal({ rootGetters ,commit }, appealInfo = {}) {
    const centerId = rootGetters["auth/getCenterId"];
    // Не писать "прочитан" если нет ответа или если уже прочитан
    if (!centerId || !appealInfo.answer || appealInfo.center_read) return;
    console.log("read appeal", appealInfo);
    await this.$api.$post(`/api/v1/appeal/read/${appealInfo.id}`)
      .then(async ({err, body}) => {
        if (!err) {
          commit("setRead", appealInfo.id);
        }
      })
  },
}
