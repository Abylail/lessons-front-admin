<template>
  <div class="appeals page">

    <v-navigation-drawer :value="showNavBar" absolute :permanent="$device.isDesktop" right>
      <v-list two-line>
        <v-list-item-group v-model="selectedAppeal">
          <template v-for="appeal in appealList">
            <v-list-item :key="appeal.id">
              <v-list-item-content>
                <v-list-item-title>Категория</v-list-item-title>
                <v-list-item-subtitle>Нет категории которая мне нужна</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>22.02.2022</v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
            <v-divider/>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

  </div>
</template>

<script>
export default {
  name: "appeals",
  data: () => ({
    appealList: [
      {id: 1},
      {id: 2},
    ],

    selectedAppeal: null,

    showMobileBar: false,
  }),
  computed: {
    showNavBar() {
      return this.$device.isDesktop || this.showMobileBar;
    }
  }
}
</script>

<style scoped>

</style>
