import { calculateZScore } from "./calculate-zscore";
import { calculateStatus } from "./calculate-status";
import type { MeasurementStatus } from "./measurement";

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
