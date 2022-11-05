<template>
  <v-app class="default-layout">

    <!-- HEADER -->
    <default-header :navBarPosition="navBarOpen" @input:navBarPosition="navBarOpen = $event"/>

    <!-- NAVIGATION BAR -->
    <default-navigation-bar :open="navBarOpen" @input:open="navBarOpen = $event"/>

    <!-- LAYOUT -->
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
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;

    ::v-deep {
      .v-application--wrap {
        min-height: 100% !important;
        overflow: auto;
      }
    }
  }
</style>
