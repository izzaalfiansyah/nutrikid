import moment from "moment";

interface FormatDateOptions {
  withTime?: boolean;
}

export function formatDate(date: Date, opt?: FormatDateOptions) {
  let format = "DD MMM YYYY";

  if (opt?.withTime) {
    format += " HH:mm";
  }

  return moment(date).format(format);
}

export function date() {
  return moment().toDate();
}
