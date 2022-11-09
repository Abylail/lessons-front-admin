export const state = () => ({
  // Список предметов (общий)
  subjectList: [],

  // Список предметов
  subjectCenterList: [],
})

export const getters = {
  // Список предметов (общий)
  getSubjectList: state => state.subjectList,
  // Список предметов центра
  getCenterSubjectList: state => state.subjectCenterList,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Получить список предметов (общий)
  async fetchSubjectList({ commit, state }) {
    if (state.subjectList.length) return;
    await this.$api.$get(`/api/v1/subject/get/`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["subjectList", body]);
        }
      })
  },

  // Получить список предметов у центра
  async fetchSubjectCenterList({ rootGetters, commit }) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$get(`/api/v1/center/subject/get/${centerId}`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["subjectCenterList", body]);
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
      .then(async ({err, body}) => {
        if (!err) {
          this.$toast.success("Предмет создан");
          await dispatch("fetchSubjectCenterList");
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
      .then(async ({err, body}) => {
        if (!err) {
          this.$toast.success("Предмет обновлен");
          await dispatch("fetchSubjectCenterList");
        }
      })
  },

  // Удалить учителя
  async deleteSubject({ dispatch }, teacherInfo) {
    await this.$api.$delete(`/api/v1/center/subject/delete/${teacherInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Предмет удален");
          dispatch("fetchSubjectCenterList");
        }
      })
  }
}
