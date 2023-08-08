
export const state = () => ({

  // Информация центра
  centerInfo: null,

  // Контакты
  contactInfo: null,
})

export const getters = {
  getCenterInfo: state => state.centerInfo,
  getContactInfo: state => state.contactInfo,
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
    await this.$api.$post(`/api/v1/center/update`, {
      ...centerInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Информация центра сохранена");
        }
      })
  },

  // Получить контакты
  async fetchContactInfo({ commit, rootGetters }) {
    const { center_id } = rootGetters["auth/getUserInfo"];
    if (!center_id) return;
    await this.$api.$get(`/api/v1/center/contact/get/${center_id}`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["contactInfo", body]);
        }
      })
  },

  // Сохранить контакты
  async saveContactInfo({ commit, rootGetters }, contacts = []) {
    const { center_id } = rootGetters["auth/getUserInfo"];
    if (!center_id) return;
    await this.$api.$post(`/api/v1/center/contact/update/${center_id}`, contacts)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Контакты центра сохранены");
        }
      })

  },

  // Удалить контакт
  async deleteContact({ commit }, contact) {
    await this.$api.$delete(`/api/v1/center/contact/remove/${contact.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Контакт удален");
        }
      })
  },
}
