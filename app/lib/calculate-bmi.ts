import type { MeasurementStatus } from "~/services/measurement/dto/measurement.dto";
import type { Student } from "~/services/student/dto/student.dto";
import { calculateAge } from "./calculate-age";
import { calculateZScore } from "./calculate-zscore";
import { calculateStatus } from "./calculate-status";

export type BmiResult = {
  status: MeasurementStatus;
  bmi: number;
  z_score: number;
};

export function calculateBmi(
  age: number,
  measurement: {
    height: number;
    weight: number;
  },
): BmiResult {
  const bmi = measurement.weight / (measurement.height / 100) ** 2;
  const z_score = calculateZScore(bmi, age);
  const status = calculateStatus(z_score);

  return {
    bmi,
    status,
    z_score,
  };
}
