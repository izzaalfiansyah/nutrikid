import moment from "moment";

export function formatDate(date: Date, withTime = false) {
  return moment(date).format(withTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD");
}
