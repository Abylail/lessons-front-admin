export const state = () => ({
  userToken: null,
  userInfo: null,
})

export const getters = {
  isAuth: state => !!state.userToken,
  getUserInfo: state => state.userInfo || {},
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // login with username ang password
  login({ commit }, {username, password}) {
    if (!username || !password) return;
    commit("userToken", "SuperToken");
    commit("userInfo", { username });
    this.$cookies.set("token", "SuperToken");
  },

  // login by token
  async tokenAuth({ state, commit }) {
    const token = state.userToken || this.$cookies.get("token");
    commit("set", ["userToken", token]);
  },

  // logout
  logout({ commit }) {
    commit("set", ["userToken", null]);
    this.$cookies.remove("userToken");
  },

}
