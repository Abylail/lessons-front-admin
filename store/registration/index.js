export const state = () => ({
  token: null,
})

export const getters = {

}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Отправка смс кода
  sendSmsCode({ commit }, {phone}) {
    const serializedPhone = "+" + phone.replaceAll(/\D+/g, "");
    return new Promise(resolve => {
      this.$api.$post("/api/v1/user/signup/send-sms", {phone: serializedPhone})
        .then(({err, body}) => {
          if (!err) commit("set", ["token", body]);
          resolve(!err);
        })
    })
  },

  // Подтверждение телефона
  confirmSmsCode({ commit, state }, {code}) {
    return new Promise(resolve => {
      this.$api.$post("/api/v1/user/signup/check-sms", {sms_code: code, token: state.token})
        .then(({err, body}) => {
          resolve(!err)
        })
    })
  },

  // Создание пароля
  setPassword({ state, dispatch }, { password, role }) {
    this.$api.$post("/api/v1/user/signup/passwords", {role_code: role, password, re_password: password, token: state.token})
      .then(({err, body}) => {
        if (!err) dispatch("auth/tokenAuth", body, {root: true});
      })
  },

}
