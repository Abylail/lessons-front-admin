const defaultUserInfo = {
  username: "",
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

  // Роль юзера
  getRole: state => state.userInfo?.role,

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
  async login({ commit }, {phone, password}) {
    if (!phone || !password) return;
    const phonePreparing = "+" + phone.replaceAll(/\D+/g, "")
    await this.$api.$post("/api/v1/user/login/phone", {phone: phonePreparing, password})
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["userInfo", body]);
          commit("set", ["userToken", body.token]);
          this.$cookies.set("token", body.token);
        }
        else {
          this.$toast.error("Ошибка при авторизации");
        }
      })
  },

  // Логин через token
  async tokenAuth({ state, commit }, newToken = null) {

    // Если новый токен
    if (newToken && newToken !== state.userToken) {
      commit("set", ["userToken", newToken]);
      this.$cookies.set("token", newToken);
    }

    const token = newToken || state.userToken || this.$cookies.get("token");
    if (!token) return;

    await this.$api.$post("/api/v1/user/login/token", {token})
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["userInfo", body]);
          if (!state.userToken) commit("set", ["userToken", token]);
        }
      })
  },

  // Выход
  logout({ commit }) {
    commit("set", ["userToken", null]);
    this.$cookies.remove("userToken");
  },

  // Информация пользователя
  async saveUserInfo({ commit, state }, {last_name, first_name}) {
    await this.$api.$post("/api/v1/user/signup/full-name", {auth_token: state.userToken, last_name, first_name})
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Данные пользователя обновленны");
        }
      })
  },
}
