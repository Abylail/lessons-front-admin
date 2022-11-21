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

  // Токен
  getUserToken: state => state.userToken,

  // Id центра
  getCenterId: state => state.userInfo?.center_id,

  // Авторизован ли пользователь
  isAuth: state => !!state.userToken,

  // Роль юзера
  getRole: state => state.userInfo?.role_code,

  // Информация юзера
  getUserInfo: state => state.userInfo || {},

  // Полное имя пользователя
  getUserFullName: state => {
    if (state.userInfo && (state.userInfo.last_name || state.userInfo.first_name))
      return `${state.userInfo?.last_name || ''} ${state.userInfo?.first_name || ''}`
    return "Неизвестный"
  },

  // Директор центра ?
  isCenterDirector: state => state.userInfo?.role_code === "center_director",
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  },
  setProperty(state, [namespace, propertyNamespace, value]) {
    let newObject = state[namespace] || {};
    newObject[propertyNamespace] = value;
    state[namespace] = newObject;
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
          this.$cookies.set("userToken", body.token);
        }
      })
  },

  // Логин через token
  async tokenAuth({ state, commit, dispatch }, newToken = null) {

    // Если новый токен
    if (newToken && newToken !== state.userToken) {
      commit("set", ["userToken", newToken]);
      this.$cookies.set("userToken", newToken);
    }

    const token = newToken || state.userToken || this.$cookies.get("userToken");
    if (!token) return;

    await this.$api.$post("/api/v1/user/login/token", {token})
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["userInfo", body]);
          if (!state.userToken) commit("set", ["userToken", token]);
        }
        else {
          dispatch("logout");
        }
      })
  },

  // Выход
  logout({ commit }) {
    commit("set", ["userToken", null]);
    commit("set", ["userInfo", null]);
    this.$cookies.remove("userToken");
  },

  // Информация пользователя
  async saveUserInfo({ commit, state }, {last_name, first_name}) {
    await this.$api.$post("/api/v1/user/signup/full-name", {auth_token: state.userToken, last_name, first_name})
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Данные пользователя обновленны");
          commit("setProperty", ["userInfo", "last_name", last_name]);
          commit("setProperty", ["userInfo", "first_name", first_name]);
        }
      })
  },
}
