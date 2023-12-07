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
  },
}

export const actions = {
  // Получить список учителей
   async fetchTeacherList({ commit, rootGetters }) {
     const centerId = rootGetters["auth/getCenterId"];
     if (!centerId) return;
     await this.$api.$get(`/api/v1/admin/institution/${centerId}/teacher/get`)
       .then(({err, body}) => {
         if (!err) {
           commit("set", ["teacherList", body]);
         }
       })
  },

  // Создать учителя
  async createTeacher({ commit, rootGetters, dispatch  }, teacherInfo) {
    const centerId = rootGetters["auth/getCenterId"];

    await this.$api.$post(`/api/v1/admin/institution/${centerId}/teacher/create`, teacherInfo)
      .then(async ({err, body}) => {
        if (!err) {
          this.$toast.success("Учитель создан");
          await dispatch("fetchTeacherList");
        }
      })
  },

  // Обновить информацию учителя
  async updateTeacher({ commit, rootGetters, dispatch  }, teacherInfo) {
     const centerId = rootGetters["auth/getCenterId"];

     await this.$api.$put(`/api/v1/admin/institution/${centerId}/teacher/update/${teacherInfo.id}`, teacherInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Учитель обновлен");
          dispatch("fetchTeacherList");
        }
      })
  },

  // Удалить учителя
  async deleteTeacher({ dispatch, rootGetters }, teacherInfo) {
    const centerId = rootGetters["auth/getCenterId"];
    await this.$api.$delete(`/api/v1/admin/institution/${centerId}/teacher/delete/${teacherInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Учитель удален");
          dispatch("fetchTeacherList");
        }
      })
  },

  // Загрузка фото
  async uploadPhoto({ commit, rootGetters, dispatch }, {base64, teacherId}) {
    const centerId = rootGetters["auth/getCenterId"];
    const { institution_id } = rootGetters["auth/getUserInfo"];
    if (!institution_id) return;
    await this.$api.$post(`/api/v1/admin/institution/${centerId}/teacher/uploadPhoto/${teacherId}`, {buffer: base64})
      .then(({err}) => {
        if (!err) {
          this.$toast.success("Фото загруженно");
        }
      })
    await dispatch("fetchTeacherList");
  },
}
