
export const state = () => ({

  // Информация центра
  centerInfo: null,

  // Контакты
  contactInfo: null,
})

export const getters = {
  getCenterInfo: state => state.centerInfo,
  getContactInfo: state => state.contactInfo,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

  // Получить информацию центра
  async fetchCenterInfo({ commit, rootGetters }) {
    const { institution_id } = rootGetters["auth/getUserInfo"];
    if (!institution_id) return;
    await this.$api.$get(`/api/v1/admin/institution/get/${institution_id}`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["centerInfo", body]);
        }
      })
  },

  // Сохранить информацию центра
  async saveCenterInfo({ commit, rootGetters }, centerInfo) {
    const { institution_id } = rootGetters["auth/getUserInfo"];
    if (!institution_id) return;
    await this.$api.$put(`/api/v1/admin/institution/update/${institution_id}`, centerInfo)
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Информация центра сохранена");
        }
      })
  },

  // Загрузка фото
  async uploadLogo({ commit, rootGetters, dispatch }, base64) {
    const { institution_id } = rootGetters["auth/getUserInfo"];
    if (!institution_id) return;
    await this.$api.$post(`/api/v1/admin/institution/update/${institution_id}/upload/logo`, {buffer: base64})
      .then(({err}) => {
        if (!err) {
          this.$toast.success("Фото загруженно");
        }
      })
    await dispatch("fetchCenterInfo");
  },

  // Загрузка фото
  async addPhoto({ commit, rootGetters, dispatch }, base64) {
    const { institution_id } = rootGetters["auth/getUserInfo"];
    if (!institution_id) return;
    await this.$api.$post(`/api/v1/admin/institution/update/${institution_id}/upload/photo`, {buffer: base64})
      .then(({err}) => {
        if (!err) {
          this.$toast.success("Фото загруженно");
        }
      })
    await dispatch("fetchCenterInfo");
  },

  // Удаление фото
  async removePhoto({ commit, rootGetters, dispatch }, imagePath) {
    const { institution_id } = rootGetters["auth/getUserInfo"];
    if (!institution_id) return;
    await this.$api.$post(`/api/v1/admin/institution/update/${institution_id}/remove/photo`, {imagePath})
      .then(({err}) => {
        if (!err) {
          this.$toast("Фото удаленно");
        }
      })
    await dispatch("fetchCenterInfo");
  },
}
