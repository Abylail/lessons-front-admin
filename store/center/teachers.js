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

  // Создать учителя
  async createTeacher({ commit, rootGetters, dispatch  }, teacherInfo) {
    const centerId = rootGetters["auth/getCenterId"];

    await this.$api.$post(`/api/v1/center/teacher/add`, {
      center_id: centerId,
      ...teacherInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Учитель создан");
          dispatch("fetchTeacherList");
        }
      })
  },

  // Обновить информацию учителя
  async updateTeacher({ commit, rootGetters, dispatch  }, teacherInfo) {
     const centerId = rootGetters["auth/getCenterId"];

     await this.$api.$put(`/api/v1/center/teacher/update/${teacherInfo.id}`, {
       center_id: centerId,
       ...teacherInfo,
     })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Учитель обновлен");
          dispatch("fetchTeacherList");
        }
      })
  },

  async deleteTeacher({ dispatch }, teacherInfo) {
    await this.$api.$delete(`/api/v1/center/teacher/delete/${teacherInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Учитель удален");
          dispatch("fetchTeacherList");
        }
      })
  }
}
