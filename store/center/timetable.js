import {uniqList} from "@/helpers/methods";

export const state = () => ({
  // Список групп
  groupList: null,
})

export const getters = {
  // Список групп
  getGroupList: state => state.groupList || [],
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  },
  updateGroup(state, group = {}) {
    const groupIndex = state.groupList.findIndex(g => g.id === group.id);
    let newList = state.groupList.slice();

    // Если группа уже есть
    if (groupIndex >= 0) newList[groupIndex] = group;
    // Если это новая группа
    else newList.push(group);

    state.groupList = newList;
  },
  deleteGroup(state, groupId) {
    const groupIndex = state.groupList.findIndex(g => g.id === groupId);
    let newList = state.groupList.slice();
    newList.splice(groupIndex, 1);
    state.groupList = newList;
  },
}


export const actions = {

  // Получить список уроков
  async fetchTimetable({ rootGetters, commit }) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$get(`/api/v1/admin/institution/${centerId}/group/get`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["groupList", uniqList(body)]);
        }
      })
  },

  // Создать группу
  createGroup({ rootGetters, commit }, groupInfo) {
    return new Promise(resolve => {
      const centerId = rootGetters["auth/getCenterId"];
      this.$api.$post(`/api/v1/admin/institution/${centerId}/group/create`, {
        center_id: centerId,
        ...groupInfo,
      })
        .then(({err, body}) => {
          if (!err) {
            this.$toast.success("Группа создана");
            commit("updateGroup", body);
          }
          resolve(!err);
        })
    })
  },

  // Обновить группу
  updateGroup({ rootGetters, commit }, groupInfo) {
    return new Promise(resolve => {
      const centerId = rootGetters["auth/getCenterId"];
      if (!centerId) return;
      this.$api.$put(`/api/v1/admin/institution/${centerId}/group/update/${groupInfo.id}`, groupInfo)
        .then(({err, body}) => {
          if (!err) {
            this.$toast.success("Группа обновленна");
            commit("updateGroup", body);
          }
          resolve(!err);
        })
    })
  },

  // Удалить группу
  async deleteGroup({ commit }, groupId) {
    await this.$api.$delete(`/api/v1/center/schedule/group/delete/${groupId}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Группа удалена");
          commit("deleteGroup", groupId);
        }
      })
  },
}
