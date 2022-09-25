const defaultUserInfo = {
  username: "",
  full_name: "",
  phone: "",
  role: "center",
  center_id: 1,
};

export const state = () => ({
  // Токен юзер
  userToken: null,

  // Информация юзера
  userInfo: null,

})

export const getters = {
  // Авторизован ли пользователь
  isAuth: state => !!state.userToken,

  // Информация юзера
  getUserInfo: state => state.userInfo || {},
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Логин через username ang password
  login({ commit }, {username, password}) {
    if (!username || !password) return;
    commit("userToken", "SuperToken");
    commit("userInfo", defaultUserInfo);
    this.$cookies.set("token", "SuperToken");
  },

  // Логин через token
  async tokenAuth({ state, commit }) {
    const token = state.userToken || this.$cookies.get("token");
    commit("set", ["userToken", token]);
    commit("set", ["userInfo", defaultUserInfo]);
  },

  // Выход
  logout({ commit }) {
    commit("set", ["userToken", null]);
    this.$cookies.remove("userToken");
  },
}
