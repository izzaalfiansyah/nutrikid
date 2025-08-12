export interface ZScoresRange {
  z: number;
  min: number;
  max: number;
}

export interface ZScore {
  month: string;
  z_scores_range: Array<ZScoresRange>;
}
