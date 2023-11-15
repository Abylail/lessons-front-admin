import {trialStatuses} from "@/config/lists";

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
  },
  setRegistration(state, registration) {
    let newRegistrations = state.registrations.slice();
    const index = newRegistrations.findIndex(r => r.id === registration.id);
    if (index < 0) registration;
    newRegistrations[index] = registration;
    state.registrations = newRegistrations;
  },
}

export const actions = {

  // Запросить список регисьтраций
  async fetchRegistrations({ commit }) {
    await this.$api.$get(`/api/v1/admin/trialregistrations/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["registrations", body]);
        }
      })
  },

  // Запросить список регисьтраций
  async setRegistrationStatus({ commit }, {status, id}) {
    await this.$api.$put(`/api/v1/admin/trialregistrations/setStatus`, {status, registration_id: id})
      .then(({err, body}) => {
        if (!err) {
          commit("setRegistration", body);
          this.$toast.success("Статус изменен");
        }
      })
  },
}
