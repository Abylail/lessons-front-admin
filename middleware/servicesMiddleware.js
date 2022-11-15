export default function ({ store, redirect, route }) {

  if (store.getters["auth/isCenterDirector"]) {
    store.dispatch("center/appeals/fetchAppealList");
  }

}
