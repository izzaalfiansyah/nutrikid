import type { MeasurementParams } from "./dto/measurement-params.dto";
import moment from "moment";
import { throwError } from "~/lib/throw-error";
import { http } from "~/lib/axios";

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
}
