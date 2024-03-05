import Vue from "vue";
import moment from "moment";

export function dateFormat(date, format = "DD.MM.yyyy") {
  return moment(date).format(format)
}
Vue.filter("dateFormat", dateFormat)

function dateTimeFormat(date) {
  return moment(date).format("DD.MM.yyyy (HH:mm)")
}
Vue.filter("dateTimeFormat", dateTimeFormat)

function dateTimeToText(date) {
  return  moment(date).lang("ru").format('LL');
}
Vue.filter("dateTimeToText", dateTimeToText)
