export const state = () => ({
  // Список игрушек
  toys: [],
})

export const getters = {
  // Список игрушек
  getToyList: state => state.toys,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {
  // Получить список игрушек
  async fetchToysList({ commit, state }, force = false) {
    if (!force && !!state.toys.length) return;
    await this.$api.$get(`/api/v1/admin/toy/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["toys", body]);
        }
      })
  },

  // Получить одну
  getOne({ commit }, toy) {
    return new Promise(resolve => {
      this.$api.$get(`/api/v1/admin/toy/get/${toy.id}`)
        .then(({err, body}) => {
          if (!err) return resolve(body);
          resolve(null);
        })
    })
  },

  // Создать игрушки
  async createToy({ rootGetters, dispatch  }, toyInfo) {
    return new Promise(resolve => {
      this.$api.$post(`/api/v1/admin/toy/create`, toyInfo)
        .then(({err, body}) => {
          if (!err) {
            this.$toast.success("Игрушка создана");
            dispatch("fetchToysList", true);
          }
          resolve(!err);
        })
    })
  },

  // Создать игрушки
  async updateToy({ rootGetters, dispatch  }, toyInfo) {
    return new Promise(resolve => {
      this.$api.$put(`/api/v1/admin/toy/update/${toyInfo.id}`, toyInfo)
        .then(({err, body}) => {
          if (!err) {
            this.$toast.success("Игрушка обновлена");
            dispatch("fetchToysList", true);
          }
          resolve(!err);
        })
    })
  },

  // Удалить категорию
  async deleteToy({ dispatch }, toyInfo) {
    return new Promise(resolve => {
      this.$api.$delete(`/api/v1/admin/toy/delete/${toyInfo.id}`)
        .then(({err, body}) => {
          if (!err) {
            this.$toast("Игрушка удалена");
            dispatch("fetchToysList", true);
          }
          resolve(!err);
        })
    })
  },

  // Загрузка фото
  async addPhoto({ commit, rootGetters, dispatch }, {buffer, toyId}) {
    await this.$api.$put(`/api/v1/admin/toy/uploadPhoto/${toyId}`, {buffer})
      .then(({err}) => {
        if (!err) {
          this.$toast.success("Фото загруженно");
        }
      })
    await dispatch("fetchToysList", true);
  },

  // Удаление фото
  async removePhoto({ commit, rootGetters, dispatch }, {imagePath, toyId}) {
    await this.$api.$put(`/api/v1/admin/toy/deletePhoto/${toyId}`, {imagePath})
      .then(({err}) => {
        if (!err) {
          this.$toast("Фото удаленно");
        }
      })
    await dispatch("fetchToysList", true);
  },
}
