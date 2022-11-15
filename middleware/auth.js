export default async function ({ store, redirect, route }) {

  // Проверка авторизации
  if (!store.getters["auth/isAuth"]) {
    await store.dispatch("auth/tokenAuth");
    if (!store.getters["auth/isAuth"]) redirect("/login");
  }
}
