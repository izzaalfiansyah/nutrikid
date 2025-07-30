import type { MeasurementStatus } from "~/services/measurement/dto/measurement.dto";

export function calculateStatus(score: number): MeasurementStatus {
  if (score < -2) {
    return "wasted";
  } else if (score <= 1) {
    return "normal";
  } else if (score <= 3) {
    return "overweight";
  } else {
    return "obese";
  }
}
