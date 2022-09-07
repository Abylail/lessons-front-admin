<template>
  <v-app-bar app>
    <v-app-bar-nav-icon v-if="!$device.isDesktop" @click="$emit('input:navBarPosition', !navBarPosition)"/>
  </v-app-bar>
</template>

<script>
export default {
  name: "defaultHeader",
  props: {
    navBarPosition: {
      type: Boolean
    }
  },
  data: () => ({

  })
}
</script>

<style scoped>

</style>
