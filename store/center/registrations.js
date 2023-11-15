export const state = () => ({
  // Регистрации на пробный
  registrations: [],
})

export const getters = {
  // Регистрации на пробный
  getRegistrations: state => state.registrations,
  getRegistrationsCount: state => state.registrations.length,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Запросить список регисьтраций
  async fetchRegistrations({ rootGetters, commit }) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$get(`/api/v1/admin/institution/${centerId}/trialregistrations/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["registrations", body]);
        }
      })
  },
}
