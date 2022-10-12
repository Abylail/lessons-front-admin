export const state = () => ({
  roles: [],
})

export const getters = {
  getRoles: state => state.roles,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Получить роли
  async fetchRoles({ commit }) {
    await this.$axios.$get("/api/v1/user/role/get")
      .then(({body}) => {
        commit("set", ["roles", body])
      })
  }
}
