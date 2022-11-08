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
  async updateGroup({ rootGetters, commit }, {newGroupInfo, oldGroupInfo}) {
    const centerId = rootGetters["auth/getCenterId"];

    // Подготваливаю дни в отправке
    let days = [];
    const oldDays = oldGroupInfo.days || [];
    const newDays = newGroupInfo.days || [];

    // Пробегаю по новым дням, если день новый добавляю is_new, если день не новый и отличается то добавляю is_update
    newDays.forEach(newDay => {
      const sameInOld = oldDays.find(od => od.code === newDay.code);
      if (!sameInOld) days.push({...newDay, is_new: true});
      else if (sameInOld.start !== newDay.start || sameInOld.end !== newDay.end) days.push({...newDay, is_update: true});
    });

    // Пробегаю по старым дням, если день удален то добавляю is_delete
    newDays.forEach(oldDay => {
      const sameInNew = newDays.find(nd => nd.code === oldDay.code);
      if (!sameInNew) days.push({...oldDay, is_delete: true})
    });

    await this.$api.$put(`/api/v1/center/schedule/group/update/${oldGroupInfo.id}`, {
      center_id: centerId,
      ...newGroupInfo,
      days,
    })
      .then(({err, body}) => {
        if (!err) {
          this.$toast.success("Группа обновленна");
          commit("updateGroup", body);
        }
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
