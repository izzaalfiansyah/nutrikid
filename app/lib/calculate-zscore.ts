export function calculateZScore(bmi: number, age: number): number {
  return (bmi - 16.2) / 3.67 + (0.23 * age) / 10;
}
