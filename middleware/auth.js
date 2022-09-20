export default async function ({ store, redirect, route }) {
  if (!store.getters["center/isAuth"]) {

    await store.dispatch("center/tokenAuth");
    if (!store.getters["center/isAuth"]) redirect("/login");
  }
}
