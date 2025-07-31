import moment from "moment";

export function formatDate(date: Date, withTime = false) {
  let format = "YYYY-MM-DD";

  if (withTime) {
    format = "YYYY-MM-DD HH:mm";
  }

  return moment(date).format(format);
}

export function date() {
  return moment().toDate();
}
