<template>
  <div class="users page">
    <h2 class="users__title">Пользователи</h2>

    <div class="categories__tools">
      <v-btn color="primary" outlined @click="createUserHandle()">Добавить пользователя +</v-btn>
    </div>

    <!-- Поиск -->
    <h3 class="users__search-title">Поиск</h3>
    <div class="users__search relative-columns-2">
      <v-text-field
        label="Поиск по имени"
        v-model="searchParams.query"
        outlined dense hide-details clearable
      />
      <v-btn color="primary" block @click="searchHandle()">Поиск</v-btn>
    </div>

    <!-- Таблица -->
    <div class="users__table-wrapper">
      <v-data-table
        class="categories__table elevation-1"
        :headers="tableHeaders"
        :items="users"
        :loading="isLoading"
        item-key="id"
        hide-default-footer
      >
        <template v-slot:item.role_id="{ item }">
          <v-select
            :value="item.role_id"
            :items="roles"
            item-value="id"
            item-text="title"
            outlined dense hide-details
            @input="bindRole($event, item)"
          />
        </template>
        <template v-slot:item.phone="{ item }">
          {{ item.phone | vmask('+7 (###) ###-##-##') }}
        </template>
        <template v-slot:item.delete="{ item }">
          <v-btn icon @click="userDeleteHandle(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>
    </div>

    <add-user-modal/>
    <remove-user-modal/>
  </div>
</template>

<script>
import AddUserModal from "@/components/common/modals/admin/addUserModal";
import {mapActions, mapGetters} from "vuex";
import RemoveUserModal from "@/components/common/modals/admin/removeUserModal";
export default {
  name: "users",
  components: {RemoveUserModal, AddUserModal},
  data: () => ({
    isLoading: false,
    searchParams: {},

    // Заголовки таблицы
    tableHeaders: [
      { text: "Имя", value: "first_name", sortable: false },
      { text: "Фамилия", value: "last_name", sortable: false },
      { text: "Телефон", value: "phone", sortable: false },
      { text: "Роль", value: "role_id", sortable: false },
      { text: "", value: "delete", sortable: false },
    ],
  }),
  computed: {
    ...mapGetters({
      users: "users/getUsers",
      roles: "users/getRoles",
    })
  },
  methods: {
    ...mapActions({
      _fetchUsers: "users/fetchUsers",
      _fetchRoles: "users/fetchRoles",
      _bindRole: "users/bindRole",
    }),

    async fetchUsers() {
      this.isLoading = true;
      await this._fetchUsers(this.searchParams);
      this.isLoading = false;
    },

    createUserHandle(user) {
      this.$modal.show("add-user")
    },

    searchHandle() {

    },

    async bindRole(role_id, user) {
      this.isLoading = true;
      await this._bindRole({role_id, user_id: user.id});
      this.isLoading = false;
    },

    // Удалить пользователя (кнопка)
    userDeleteHandle(user) {
     this.$modal.show("remove-user", {user})
    },
  },
  async mounted() {
    await this._fetchRoles();
    this.fetchUsers();
  }
}
</script>

<style lang="scss" scoped>
.users {

  &__title {
    margin-bottom: 20px;
  }

  &__search-title {
    margin-top: 20px;
  }

  &__search {
    & > * {
      margin: 5px 0;
    }
  }

  &__table-wrapper {
    margin-top: 20px;
    max-height: calc(100vh - 350px);
    @media (max-height: $break-point) {
      max-height: none;
    }
  }

}
</style>
