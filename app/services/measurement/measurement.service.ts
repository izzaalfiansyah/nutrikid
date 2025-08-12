import type { MeasurementParams } from "./dto/measurement-params.dto";
import { throwError } from "~/lib/throw-error";
import { http } from "~/lib/axios";

const male_default_zscores = "male_default_zscores";
const female_default_zscores = "female_default_zscores";

export class MeasurementService {
  static async findAll(params?: MeasurementParams) {
    try {
      const res = await http().get("/measurement", {
        params,
      });

      return res.data.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async show(id: number) {
    try {
      const res = await http().get("/measurement/" + id);

      return res.data.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async store(params: Measurement) {
    try {
      const res = await http().post("/measurement", params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async update(params: Measurement) {
    try {
      const res = await http().put("/measurement/" + params.id, params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async destroy(params: Measurement) {
    try {
      const res = await http().delete("/measurement/" + params.id);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async getSuggestions(params: Measurement) {
    try {
      const res = await http().get("/measurement/" + params.id + "/suggestion");

      return res.data.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async storeSuggestion(params: MeasurementSuggestion) {
    try {
      const res = await http().post(
        "/measurement/" + params.measurement_id + "/suggestion",
        params,
      );

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async getDefaultZScore(gender: Gender): Promise<Array<ZScore>> {
    const key = gender == "l" ? male_default_zscores : female_default_zscores;
    const encodedData = localStorage.getItem(key);

    if (!!encodedData) {
      return JSON.parse(encodedData);
    }

    try {
      const res = await http().get("/default-zscore", {
        params: { gender },
      });

      const zscores = res.data.data.z_scores;

      if (zscores) {
        localStorage.setItem(key, JSON.stringify(zscores));
      }

      return zscores;
    } catch (err) {
      throwError(err);
    }

    return [];
  }
}
