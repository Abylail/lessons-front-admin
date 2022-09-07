<template>
  <v-app>

    <!-- HEADER -->
    <default-header :navBarPosition="navBarOpen" @input:navBarPosition="navBarOpen = $event"/>

    <!-- NAVIGATION BAR -->
    <default-navigation-bar :open="navBarOpen" @input:open="navBarOpen = $event"/>

    <v-main>
      <Nuxt/>
    </v-main>


  </v-app>
</template>

<script>
import DefaultHeader from "@/components/common/layout/defaultHeader";
import DefaultNavigationBar from "@/components/common/layout/defaultNavigationBar";
export default {
  name: 'DefaultLayout',
  components: {DefaultNavigationBar, DefaultHeader},
  middleware: "auth",
  data: () => ({

    // Не работает на компе
    navBarOpen: false,

  })
}
</script>
<style lang="scss" scoped>
  .default-layout {



  }
</style>
