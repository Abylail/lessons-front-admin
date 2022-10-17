
export const state = () => ({

  // Информация центра
  centerInfo: null,
})

export const getters = {
  getCenterInfo: state => state.centerInfo || {},
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Получить информацию центра
  async fetchCenterInfo({ commit }) {

  },

  // Сохранить информацию центра
  async saveCenterInfo({ commit }) {

  },
}
