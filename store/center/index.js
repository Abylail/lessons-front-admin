const defaultUserInfo = {
  username: "incode",
  userPhone: "+7 (705) 670-78-91",
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

const defaultWorkSchedule = {
  monday: {start: "09:00", end: "18:00"},
  tuesday: {start: "09:00", end: "18:00"},
  wednesday: {start: "09:00", end: "18:00"},
  thursday: {start: "09:00", end: "18:00"},
  friday: {start: "09:00", end: "18:00"},
  saturday: {start: "09:00", end: "18:00"},
  sunday: null,
}

const defaultPromotions = [
  {
    content: "", // html
    title: "Скидка на первый урок", // title
    status: "Ожидает ответа", // status
    created: "", // Дата создания
    updated: "", // Дата обновления
  },
]

export const state = () => ({
  // Токен юзер
  userToken: null,

  // Информация юзера
  userInfo: null,

  // Рабочий график
  workSchedule: null,

  // Список акций
  promotions: null,

  // Список учителей
  teachers: [],
})

export const getters = {

  // Авторизован ли пользователь
  isAuth: state => !!state.userToken,

  // Информация юзера
  getUserInfo: state => state.userInfo || {}, // { name, description, maxAge, minAge }

  // Рабочий график
  getWorkSchedule: state => state.workSchedule,

  // Список акций
  getPromotions: state => state.promotions,

  // Список учителей
  getTeachers: state => state.teachers, // [ {id, name} ]
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

  // Запросить график работы
  fetchWorkSchedule({ commit }) {
    commit("set", ["workSchedule", defaultWorkSchedule]);
  },

  // Запросить список акций
  fetchPromotions({ commit }) {
    commit("set", ["promotions", defaultPromotions]);
  },

  // Запросить список учителей
  fetchTeachers({ commit }) {
    commit("set", ["teachers", [{id: 1, name: "Феликс"}, {id: 2, name: "Марат"}]]);
  },

}
