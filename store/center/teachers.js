export const state = () => ({
  // Список учителей
  teacherList: [],
})

export const getters = {
  // Список учителей
  getTeacherList: state => state.teacherList,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Получить список учителей
   async fetchTeacherList({ commit, rootGetters }) {
     const centerId = rootGetters["auth/getCenterId"];
     if (!centerId) return;
     await this.$api.$get(`/api/v1/center/teacher/get/list/${centerId}`)
       .then(({err, body}) => {
         if (!err) {
           commit("set", ["teacherList", body]);
         }
       })
  },

  // Обновить информацию учителя
  updateTeacher({ commit }) {

  },
}
