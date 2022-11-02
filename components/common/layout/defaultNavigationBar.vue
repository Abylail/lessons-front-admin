<template>
  <v-navigation-drawer app :value="open" :permanent="$device.isDesktop" @input="$emit('input:open', $event)">

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
        :to="route"
        link
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

export default {
  name: "defaultNavigationBar",
  props: {
    open: {
      type: Boolean
    }
  },
  data: () => ({
    links: [
      { icon: "mdi-domain", name: "Моя компания", route: "/center/settings", roles: ["center_director"]},
      { icon: "mdi-timetable", name: "Расписание", route: "/center/timetable", roles: ["center_director"]},
      { icon: "mdi-human", name: "Учителя", route: "/center/teachers", roles: ["center_director"]},
      { icon: "mdi-map-marker", name: "Адреса и филиалы", route: "/center/branches", roles: ["center_director"]},
      { icon: "mdi-bookshelf", name: "Список моих предметов", route: "/center/subjects", roles: ["center_director"]},

      { icon: "mdi-cog", name: "Основные настройки", route: "/admin/settings", roles: ["admin"]},
      { icon: "mdi-format-list-bulleted", name: "Категории", route: "/admin/categories", roles: ["admin"]},
      { icon: "mdi-book-multiple", name: "Предметы", route: "/admin/subjects", roles: ["admin"]},
    ]
  }),
  computed: {
    ...mapGetters({
      role: "auth/getRole",
      userFullName: "auth/getUserFullName",
    }),

    // Роль на русском
    roleDescription() {
      return {
        admin: "Администратор",
        center_director: "Директор центра",
      }[this.role] || "";
    },
  },
  methods: {
    roleAccess(linkRoles) {
      return linkRoles.includes(this.role);
    }
  }
}
</script>

<style lang="scss" scoped>
.navigation-bar {

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
