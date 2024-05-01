export const state = () => ({
  phone: null,
})

export const getters = {
  getPhone: state => state.phone,
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
      this.$api.$post("/api/v1/admin/user/sendConfirmSms", {phone: serializedPhone})
        .then(({err, body}) => {
          if (!err) {
            commit("set", ["phone", serializedPhone]);
            commit("set", ["token", body]);
          }
          resolve(!err);
        })
    })
  },

  // Создание пароля
  sendInfo({ state, dispatch, commit }, form) {
    return new Promise(resolve => {
      this.$api.$post("/api/v1/admin/user/center/register", {...form, phone: state.phone})
        .then(async ({err, body}) => {
          if (!err) this.$cookies.set("userToken", body.token);
          resolve(!err);
        })
    })
  },

}
