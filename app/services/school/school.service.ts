import { throwError } from "~/lib/throw-error";
import { http } from "~/lib/axios";

export class SchoolService {
  static async findAll() {
    try {
      const res = await http().get("/school");

      return res.data.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async store(params: School) {
    try {
      const res = await http().post("/school", params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async update(params: School) {
    try {
      const res = await http().put("/school/" + params.id, params);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }

  static async destroy(params: School) {
    try {
      const res = await http().delete("/school/" + params.id);

      return res.data;
    } catch (err) {
      throwError(err);
    }
  }
}
