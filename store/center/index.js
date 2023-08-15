
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
    const { institution_id } = rootGetters["auth/getUserInfo"];
    if (!institution_id) return;
    await this.$api.$get(`/api/v1/admin/institution/get/${institution_id}`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["centerInfo", body]);
        }
      })
  },

  // Сохранить информацию центра
  async saveCenterInfo({ commit, rootGetters }, centerInfo) {
    const { institution_id } = rootGetters["auth/getUserInfo"];
    await this.$api.$put(`/api/v1/admin/institution/update/${institution_id}`, {
      ...centerInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          console.log(body);
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
}
