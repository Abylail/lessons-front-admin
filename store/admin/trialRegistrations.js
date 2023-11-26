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

  // Обновить данные регситрации
  updateRegistration({ commit }, {title, date, weekday, time, id}) {
    return new Promise(resolve => {
      this.$api.$put(`/api/v1/admin/trialregistrations/update/${id}`, {title, date, weekday, time})
        .then(({err, body}) => {
          if (!err) {
            commit("setRegistration", body);
            this.$toast.success("Регистрация изменена");
          }
          resolve(!err);
        })
    })
  },

  // Обновить статус регситрации
  async setRegistrationStatus({ commit }, {status, id}) {
    await this.$api.$put(`/api/v1/admin/trialregistrations/setStatus`, {status, registration_id: id})
      .then(({err, body}) => {
        if (!err) {
          commit("setRegistration", body);
          this.$toast.success("Статус изменен");
        }
      })
  },

  // Запросить список регисьтраций
  async deleteRegistration({ commit }, registrationId) {
    await this.$api.$delete(`/api/v1/admin/trialregistrations/delete/${registrationId}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Запись удалена");
        }
      })
  },
}
