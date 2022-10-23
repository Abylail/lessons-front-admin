<template>
  <div>Мне некуда кидать юзеров с новыми ролями</div>
</template>
<script>
export default {
  middleware({ redirect, store }) {

    // Директор центра
    if (["center_director"].includes(store.getters["auth/getRole"])) {
      redirect("/center/settings");
    }

    // Админ
    else if (["admin"].includes(store.getters["auth/getRole"])) {
      redirect("/admin/settings");
    }
  }
}
</script>
