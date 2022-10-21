<template>
  <div>Мне некуда кидать юзеров с новыми ролями</div>
</template>
<script>
export default {
  middleware({ redirect, store }) {
    if (store.getters["auth/getRole"] === "center_director") {
      redirect("/center/settings");
    }
  }
}
</script>
