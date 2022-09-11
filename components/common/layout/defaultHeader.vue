<template>
  <v-app-bar app>
    <v-app-bar-nav-icon v-if="!$device.isDesktop" @click="$emit('input:navBarPosition', !navBarPosition)"/>
    <v-spacer/>
    <v-btn icon @click="logoutHandle()"><v-icon>mdi-logout</v-icon></v-btn>
  </v-app-bar>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "defaultHeader",
  props: {
    navBarPosition: {
      type: Boolean
    }
  },
  data: () => ({

  }),
  methods: {
    ...mapActions({
      _logout: "user/logout",
    }),
    logoutHandle() {
      this._logout();
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>

</style>
