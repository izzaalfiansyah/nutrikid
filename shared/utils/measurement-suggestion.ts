import moment from "moment";
import type { Measurement } from "./measurement";
import type { Profile } from "./profile";

export interface MeasurementSuggestion {
  id: number;
  measurement_id?: number;
  measurement?: Measurement;
  creator_id?: number;
  creator?: Profile;
  advice: string;
  created_at: Date;
}

export function measurementSuggestionFromJson(
  data: any,
): MeasurementSuggestion {
  return {
    id: data.id,
    measurement_id: data.measurement_id,
    measurement: data.measurement,
    creator_id: data.creator_id,
    creator: data.creator,
    advice: data.advice,
    created_at: moment(data.created_at).toDate(),
  };
}
