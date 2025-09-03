import { http } from "~/lib/axios";
import type { Team } from "~/types/team";

export class TeamService {
  static async findAll(): Promise<Team[]> {
    try {
      const result = await http().get("/team");

      return result.data.data.teams;
    } catch (err) {
      return [];
    }
  }
}
