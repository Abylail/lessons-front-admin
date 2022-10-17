<template>
  <v-navigation-drawer app :value="open" :permanent="$device.isDesktop" @input="$emit('input:open', $event)">

    <!-- USER CARD -->
    <v-sheet class="pa-4">
      <div>
      <v-avatar class="mr-2" color="primary" size="48">
        <span class="white--text">A</span>
      </v-avatar>
      <span class="navigation-bar__name">Incode academy</span>
      </div>
    </v-sheet>

    <!-- LINKS -->
    <v-list>
      <v-list-item
        v-for="({icon, name, route}, index) in links"
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
      { icon: "mdi-domain", name: "Моя компания", route: "/center/settings", role: "center"},
      { icon: "mdi-timetable", name: "Расписание", route: "/center/timetable", role: "center"},
      { icon: "mdi-human", name: "Учителя", route: "/center/teachers", role: "center"},
    ]
  }),
  computed: {
    ...mapGetters({})
  }
}
</script>

<style lang="scss" scoped>
.navigation-bar {

  &__name {
    padding: 10px 0;
  }

}
</style>
