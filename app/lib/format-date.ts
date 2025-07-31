import moment from "moment";

interface FormatDateOptions {
  withTime?: boolean;
}

export function formatDate(date: Date, opt?: FormatDateOptions) {
  let format = "YYYY-MM-DD";

  if (opt?.withTime) {
    format = "YYYY-MM-DD HH:mm";
  }

  return moment(date).format(format);
}

export function date() {
  return moment().toDate();
}
