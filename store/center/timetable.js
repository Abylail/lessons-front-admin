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
  }
}


export const actions = {

  // Получить список уроков
  async fetchTimetable({ rootGetters, commit }) {
    const centerId = rootGetters["auth/getCenterId"];
    if (!centerId) return;
    await this.$api.$get(`/api/v1/center/schedule/group/get/${centerId}`)
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["groupList", body]);
        }
      })
  },

  // Создать группу
  async createGroup({ rootGetters, commit }, groupInfo) {
    const centerId = rootGetters["auth/getCenterId"];

    await this.$api.$post(`/api/v1/center/schedule/group/add`, {
      center_id: centerId,
      ...groupInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Группа создана");
          commit("updateGroup", body);
        }
      })
  },

  // Обновить группу
  async updateGroup({ rootGetters, commit }, groupInfo) {
    const centerId = rootGetters["auth/getCenterId"];

    await this.$api.$put(`/api/v1/center/schedule/group/update/${groupInfo.id}`, {
      center_id: centerId,
      ...groupInfo,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Группа обновленна");
          commit("updateGroup", body);
        }
      })
  },

  // Удалить группу
  deleteGroup() {

  },
}
