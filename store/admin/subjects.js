export const state = () => ({
  // Список предметов
  subjectList: [],

  // Последние параметры поиска
  lastSearchParams: {query: null, categoryId: null},
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
  async fetchSubjectList({ commit }, {query = null, categoryCode = null}) {
    await this.$api.$get(`/api/v1/admin/subject/get/${categoryCode || ""}`, {
      params: { query }
    })
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["subjectList", body]);
          commit("set", ["lastSearchParams", {query, categoryCode}]);
        }
      })
  },

  // Создать предмет
  async createSubject({ dispatch, state }, subjectInfo) {
    await this.$api.$post(`/api/v1/admin/subject/create`, subjectInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Предмет создан");
          dispatch("fetchSubjectList", state.lastSearchParams);
        }
      })
  },

  // Обновить предмет
  async updateSubject({ dispatch, state }, subjectInfo) {
    await this.$api.$put(`/api/v1/admin/subject/update/${subjectInfo.code}`, subjectInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Предмет обновлен");
          dispatch("fetchSubjectList", state.lastSearchParams);
        }
      })
  },



  // Удалить предмет
  async deleteSubject({ dispatch, state }, subjectInfo) {
    await this.$api.$delete(`/api/v1/admin/subject/delete/${subjectInfo.code}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Предмет удален");
          dispatch("fetchSubjectList", state.lastSearchParams);
        }
      })
  }
}
