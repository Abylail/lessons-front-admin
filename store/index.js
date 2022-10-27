export const state = () => ({
  // Роли
  roles: [],

  // Города
  cities: [],
})

export const getters = {
  // Роли
  getRoles: state => state.roles,

  // Города
  getCities: state => state.cities,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Получить роли
  async fetchRoles({ commit, state }) {
    if (state.roles.length) return;
    await this.$axios.$get("/api/v1/user/role/get")
      .then(({body}) => {
        commit("set", ["roles", body])
      })
  },

  // Получить роли
  async fetchCities({ commit, state }) {
    if (state.cities.length) return;
    await this.$axios.$get("/api/v1/city/get")
      .then(({body}) => {
        commit("set", ["cities", body])
      })
  },
}
