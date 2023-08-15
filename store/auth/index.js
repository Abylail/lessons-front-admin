const defaultUserInfo = {
  username: "",
  phone: "",
  role: "center",
  center_id: 1,
};

export const state = () => ({

  // Информация юзера
  userInfo: null,

})

export const getters = {

  // Id центра
  getCenterId: state => state.userInfo?.institution_id,

  // Авторизован ли пользователь
  isAuth: state => !!state.userInfo,

  // Роль юзера
  getRole: state => state.userInfo?.role?.code,

  // Информация юзера
  getUserInfo: state => state.userInfo || {},

  // Полное имя пользователя
  getUserFullName: state => {
    if (state.userInfo && (state.userInfo.last_name || state.userInfo.first_name))
      return `${state.userInfo?.last_name || ''} ${state.userInfo?.first_name || ''}`
    return "Неизвестный"
  },

  // Директор центра ?
  isCenterDirector: state => state.userInfo?.role?.code === "center_director",
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
    await this.$api.$post("/api/v1/admin/user/login", {phone, password})
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["userInfo", body]);
          this.$cookies.set("userToken", body.token);
        }
      })
  },

  // Логин через token
  async tokenAuth({ commit, dispatch }) {

    await this.$api.$get("/api/v1/admin/user/login/token")
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["userInfo", body]);
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
    await this.$api.$put("/api/v1/admin/user/update", {auth_token: state.userToken, last_name, first_name})
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Данные пользователя обновленны");
          commit("setProperty", ["userInfo", "last_name", last_name]);
          commit("setProperty", ["userInfo", "first_name", first_name]);
        }
      })
  },
}
