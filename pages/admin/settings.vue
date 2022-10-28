<template>
  <div class="page">

    <!-- Информация пользователя -->
    <user-info/>

    <v-divider class="mt-3 mb-3"/>
  </div>
</template>

<script>
import UserInfo from "../../components/common/user/userInfo";
export default {
  name: "settings",
  components: {UserInfo}
}
</script>

<style scoped>

</style>
