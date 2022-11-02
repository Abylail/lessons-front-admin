export const state = () => ({
  // Список предметов
  subjectList: [],
})

export const getters = {
  // Список предметов
  getSubjectList: state => state.subjectList,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Получить список предметов
  async fetchSubjectList({ rootGetters, commit }) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$get(`/api/v1/center/subject/get/${centerId}`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["branchList", body]);
        }
      })
  },

  // Создать предмет
  async createSubject({commit, rootGetters, dispatch}, subjectInfo) {
    const centerId = rootGetters["auth/getCenterId"];

    await this.$api.$post(`/api/v1/center/subject/add`, {
      center_id: centerId,
      ...subjectInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Предмет создан");
          dispatch("fetchSubjectList");
        }
      })
  },

  // Обновить предмет
  async updateSubject({ commit, rootGetters, dispatch  }, subjectInfo) {
    const centerId = rootGetters["auth/getCenterId"];

    await this.$api.$put(`/api/v1/center/subject/update/${subjectInfo.id}`, {
      center_id: centerId,
      ...subjectInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Предмет обновлен");
          dispatch("fetchSubjectList");
        }
      })
  },

  // Удалить учителя
  async deleteSubject({ dispatch }, teacherInfo) {
    await this.$api.$delete(`/api/v1/center/subject/delete/${teacherInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Предмет удален");
          dispatch("fetchSubjectList");
        }
      })
  }
}
