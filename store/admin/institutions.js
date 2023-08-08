import {rolesDict} from "@/config/roles";

export const state = () => ({
  list: [],
})

export const getters = {
  getList: state => state.list,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  },
  changeInstitution(state, institutionInfo) {
    let newList = state.list.slice();
    const institutionIndex = newList.findIndex(institution => institutionInfo.id === institution.id);
    if (institutionIndex >= 0) newList[institutionIndex] = institutionInfo;
    else newList.push(institutionInfo);
    state.list = newList;
  },
  deleteInstitution(state, institutionInfo) {
    let newList = state.list.slice();
    const institutionIndex = newList.findIndex(institution => institutionInfo.id === institution.id);
    if (institutionIndex >= 0) newList.splice(institutionIndex, 1);
    state.list = newList;
  },
}

export const actions = {
  async fetchInstitutions({ commit }) {
    await this.$axios.$get("/api/v1/admin/institution/get")
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["list", body]);
        }
      })
  },

  createInstitutions({ commit }, institutionInfo) {
    return new Promise(resolve => {
      this.$axios.$post(`/api/v1/admin/institution/create`, institutionInfo)
        .then(({err, body}) => {
          if (!err) commit("changeInstitution", body);
          resolve(!err);
        })
    })
  },

  updateInstitutions({ commit }, institutionInfo) {
    return new Promise(resolve => {
      this.$axios.$put(`/api/v1/admin/institution/update/${institutionInfo.id}`, institutionInfo)
        .then(({err, body}) => {
          if (!err) commit("changeInstitution", body);
          resolve(!err);
        })
    })
  },

  deleteInstitutions({ commit }, institutionInfo) {
    return new Promise(resolve => {
      this.$axios.$delete(`/api/v1/admin/institution/delete/${institutionInfo.id}`)
        .then(({err, body}) => {
          if (!err) commit("deleteInstitution", institutionInfo);
          resolve(!err);
        })
    })
  },

  searchDirector({}, phone) {
    return new Promise(resolve => {
      this.$axios.$get(`/api/v1/admin/users/get`, {params: {phone, role_id: rolesDict.center_director.id}})
        .then(({err, body}) => {
          resolve(body || []);
        })
    })
  },
}
