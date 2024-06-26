<template>
  <v-navigation-drawer class="navigation-bar" app :value="open" :permanent="$device.isDesktop" @input="$emit('input:open', $event)">

    <!-- USER CARD -->
    <v-sheet class="pa-4">
      <div class="navigation-bar__avatar">
      <v-avatar class="mr-2" color="primary" size="48">
        <span class="white--text">{{ userFullName[0] }}</span>
      </v-avatar>
        <div>
          <div class="navigation-bar__name">{{ userFullName }}</div>
          <div class="navigation-bar__role">{{ roleDescription }}</div>
        </div>
      </div>
    </v-sheet>

    <!-- LINKS -->
    <v-list>
      <v-list-item
        v-for="({icon, name, route, roles}, index) in links"
        v-show="roleAccess(roles)"
        :key="index"
        link
        @click="goRoute(route)"
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import {rolesDict} from "@/config/roles";

export default {
  name: "defaultNavigationBar",
  props: {
    open: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      role: "auth/getRole",
      userFullName: "auth/getUserFullName",
      newCenterAppealsCount: "center/appeals/getNewAnsweredCount",
      registrationsCount: "center/registrations/getRegistrationsCount",
    }),

    // Роль на русском
    roleDescription() {
      return {
        admin: "Администратор",
        center_director: "Директор центра",
      }[this.role] || "";
    },

    links() {
      return [
        { icon: "mdi-domain", name: "Моя компания", route: "/center/settings", roles: [rolesDict.center_director.code]},
        { icon: "mdi-timetable", name: "Расписание", route: "/center/timetable", roles: [rolesDict.center_director.code]},
        { icon: "mdi-human", name: "Учителя", route: "/center/teachers", roles: [rolesDict.center_director.code]},
        { icon: "mdi-map-marker", name: "Адреса и филиалы", route: "/center/branches", roles: [rolesDict.center_director.code]},
        { icon: "mdi-bookshelf", name: "Мои предметы", route: "/center/subjects", roles: [rolesDict.center_director.code]},
        { icon: "mdi-account-group", name: `Записи ${this.registrationsCount ? `(${this.registrationsCount})`: ""}`, route: "/center/registrations", roles: [rolesDict.center_director.code]},
        { icon: "mdi-help-circle-outline", name: "Помощь", route: "https://wa.me/+77056707891", roles: [rolesDict.center_director.code]},
        // { icon: "mdi-email-outline", name: `Мои обращения ${this.newCenterAppealsCount ? `(${this.newCenterAppealsCount})` : ""}`, route: "/center/appeals", roles: [rolesDict.center_director.code]},

        { icon: "mdi-cog", name: "Основные настройки", route: "/admin/settings", roles: [rolesDict.admin.code]},
        { icon: "mdi-list-box", name: "Объявления", route: "/admin/announcements", roles: [rolesDict.admin.code]},
        { icon: "mdi-teddy-bear", name: "Игрушки", route: "/admin/toys", roles: [rolesDict.admin.code]},
        { icon: "mdi-teddy-bear", name: "Категории игрушек", route: "/admin/toysCategories", roles: [rolesDict.admin.code]},
        { icon: "mdi-teddy-bear", name: "Подписчики", route: "/admin/toysSubscribers", roles: [rolesDict.admin.code]},
        { icon: "mdi-teddy-bear", name: "Заявки на подписку", route: "/admin/toysSubscribeRequest", roles: [rolesDict.admin.code]},
        { icon: "mdi-teddy-bear", name: "Пакеты", route: "/admin/toysPacks", roles: [rolesDict.admin.code]},
        { icon: "mdi-format-list-bulleted", name: "Категории", route: "/admin/categories", roles: [rolesDict.admin.code]},
        { icon: "mdi-book-multiple", name: "Предметы", route: "/admin/subjects", roles: [rolesDict.admin.code]},
        { icon: "mdi-account-group", name: "Пользователи", route: "/admin/users", roles: [rolesDict.admin.code]},
        { icon: "mdi-school-outline", name: "Учреждения", route: "/admin/institutions", roles: [rolesDict.admin.code]},
        { icon: "mdi-account-group", name: "Записи от клиентов", route: "/admin/trialRegistrations", roles: [rolesDict.admin.code]},
        { icon: "mdi-email-outline", name: "Обращения", route: "/admin/requests", roles: [rolesDict.admin.code]},
      ]
    }
  },
  methods: {
    roleAccess(linkRoles) {
      return linkRoles.includes(this.role);
    },

    goRoute(route) {
      if (route.startsWith("http")) window.location = route;
      else this.$router.push(route);
    }
  }
}
</script>

<style lang="scss" scoped>
.navigation-bar {
  max-height: 100vh;
  overflow: auto;

  &__avatar {
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-column-gap: 10px;
  }

  &__name {
    padding-top: 10px;
  }

  &__role {
    font-size: 14px;
    color: $color--gray;
  }

}
</style>
