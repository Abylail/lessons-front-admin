export default async function ({ store, redirect, route }) {
  if (!store.getters["user/isAuth"]) {

    await store.dispatch("user/tokenAuth");
    if (!store.getters["user/isAuth"]) redirect("/login");
  }
}
