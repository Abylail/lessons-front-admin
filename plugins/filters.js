import Vue from "vue";
import moment from "moment";

function dateFormat(date) {
  return moment(date).format("DD.MM.yyyy")
}
Vue.filter("dateFormat", dateFormat)

function dateTimeFormat(date) {
  return moment(date).format("DD.MM.yyyy (HH:mm)")
}
Vue.filter("dateTimeFormat", dateTimeFormat)
