export default async function ({ store, redirect, route }) {
  if (!store.getters["auth/isAuth"]) {
    await store.dispatch("auth/tokenAuth");
    if (!store.getters["auth/isAuth"]) redirect("/login");
  }
}
