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

  // Отправка основной информации (телефон + роль)
  sendInfo({  }, {phone, role}) {

  },

  // Отправка смс кода
  async sendSmsCode({ commit }, {phone}) {
    const serializedPhone = "+" + phone.replaceAll(/\D+/g, "");
    await this.$axios.$post("/api/v1/user/signup/send-sms", {phone: serializedPhone})
      .then(({body}) => {
        commit("set", ["token", body]);
      })
  },

  // Подтверждение телефона
  async confirmSmsCode({ commit, state }, {code}) {
    await this.$axios.$post("/api/v1/user/signup/check-sms", {sms_code: code, token: state.token})
      .then(({body}) => {
        console.log(body)
      })
    return true;
  },

  // Создание пароля
  setPassword({ state }, { password }) {
    this.$axios.$post("/api/v1/user/signup/passwords", {password, re_password: password, token: state.token})
      .then(({body}) => {
        console.log(body)
      })
  },

}
