import {phonePreparing} from "@/helpers/methods";

export const state = () => ({
  users: [],
  roles: [],
})

export const getters = {
  getUsers: state => state.users,
  getRoles: state => state.roles,
}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  },
  addUser(state, user) {
    state.users.push(user);
  },
  setUserRole(state, {user_id, role_id}) {
    let newUsers = state.users.slice();
    let userIndex = newUsers.findIndex(user => user.id === user_id);
    if (userIndex < 0) return;
    newUsers[userIndex].role_id = role_id;
    state.users = newUsers;
  },
  deleteUser(state, userId) {
    let newUsers = state.users.slice();
    let userIndex = newUsers.findIndex(user => user.id === userId);
    if (userIndex < 0) return;
    newUsers.splice(userIndex, 1);
    state.users = newUsers;
  }
}

export const actions = {

  // Создание пользователя (возвращает успешно ли)
  async createUser({ commit }, userInfo) {
    return new Promise(resolve => {
      const preparedPhone = phonePreparing(userInfo.phone)
      this.$api.$post("/api/v1/admin/user/register", {...userInfo, phone: preparedPhone})
        .then(({err, body}) => {
          if (!err) {
            this.$toast("Пользователь создан")
            commit("addUser", body)
          }
          resolve(!err);
        })
    })
  },

  async fetchRoles({ commit, state }) {
    if (state.roles.length > 0) return;
    await this.$api.$get("/api/v1/admin/role/get")
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["roles", body])
        }
      })
  },

  async fetchUsers({ commit }, searchParams = {}) {
    await this.$api.$get("/api/v1/admin/users/get")
      .then(({err, body}) => {
        if (!err) {
          commit("set", ["users", body])
        }
      })
  },

  async bindRole({ commit }, {user_id, role_id}) {
    await this.$api.$post("/api/v1/admin/users/bind", {user_id, role_id})
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Роль измененна")
          commit("setUserRole", {user_id, role_id})
        }
      })
  },

  async deleteUser({commit}, user_id) {
    await this.$api.$delete(`/api/v1/admin/users/delete/${user_id}`)
      .then(({err, body}) => {
        if (!err) {
          this.$toast("Пользователь удален")
          commit("deleteUser", user_id)
        }
      })
  },
}
