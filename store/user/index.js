const defaultUserInfo = {
  username: "incode",
  role: "center", // center, admin, teacher
  name: "InCode academy",
  description: "Robotics for children",
  minAge: 5,
  maxAge: 10,
  instagram: "https://instagram.com/incode.academy",
  whatsapp: "+7 (705) 670-78-91",
  phone: "+7 (705) 670-78-91",
  phone2: "+7 (705) 670-78-92",
  addresses: [{city: "Алматы", address: "Наурызбай батыра 50"}],
}

export const state = () => ({
  userToken: null,
  userInfo: null,
})

export const getters = {
  isAuth: state => !!state.userToken,
  getUserInfo: state => state.userInfo || {}, // { name, description, maxAge, minAge }
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
    commit("userInfo", defaultUserInfo);
    this.$cookies.set("token", "SuperToken");
  },

  // login by token
  async tokenAuth({ state, commit }) {
    const token = state.userToken || this.$cookies.get("token");
    commit("set", ["userToken", token]);
    commit("set", ["userInfo", defaultUserInfo]);
  },

  // logout
  logout({ commit }) {
    commit("set", ["userToken", null]);
    this.$cookies.remove("userToken");
  },

}
