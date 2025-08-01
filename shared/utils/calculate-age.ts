import moment from "moment";

export function calculateAge(birth_date: Date): number {
  return moment().diff(moment(birth_date), "years");
}
