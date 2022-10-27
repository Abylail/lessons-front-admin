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
  async fetchSubjectList({ commit }, {query = null, categoryId = null}) {
    await this.$api.$get(`/api/v1/subject/get/${categoryId || ""}`, {
      params: { query }
    })
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["subjectList", body]);
          commit("set", ["lastSearchParams", {query, categoryId}]);
        }
      })
  },

  // Создать предмет
  async createSubject({ dispatch, state }, subjectInfo) {
    await this.$api.$post(`/api/v1/subject/add`, subjectInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Предмет создан");
          dispatch("fetchSubjectList", state.lastSearchParams);
        }
      })
  },

  // Обновить предмет
  async updateSubject({ dispatch, state }, {newSubject, oldSubject}) {

    // Новая связка
    const bind_categories = newSubject.categories.filter(categoryId => oldSubject.categories.indexOf(categoryId) === -1);
    // Удаленная свзяка
    const unbind_categories = oldSubject.categories.filter(categoryId => newSubject.categories.indexOf(categoryId) === -1);

    const subjectInfo = {...newSubject, bind_categories, unbind_categories};
    await this.$api.$put(`/api/v1/subject/update/${subjectInfo.id}`, subjectInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Предмет обновлен");
          dispatch("fetchSubjectList", state.lastSearchParams);
        }
      })
  },



  // Удалить предмет
  async deleteSubject({ dispatch, state }, subjectInfo) {
    await this.$api.$delete(`/api/v1/subject/delete/${subjectInfo.id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Предмет удален");
          dispatch("fetchSubjectList", state.lastSearchParams);
        }
      })
  }
}
