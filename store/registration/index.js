export const state = () => ({

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
  sendSmsCode({}, {phone}) {
    const serializedPhone = "+" + phone.replaceAll(/\D+/g, "");
    this.$axios.$post("/api/v1/user/signup/send-sms", {phone: serializedPhone})
      .then((response) => {
        console.log(response);
      })
  },

  // Подтверждение телефона
  confirmSmsCode({}, {code}) {

  },

  // Создание пароля
  setPassword({}, {password}) {

  },

}
