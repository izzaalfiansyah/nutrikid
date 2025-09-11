import { http } from "~/lib/axios";
import type { Team } from "~/types/team";

export class TeamService {
  static async findAll(): Promise<{
    teams: Team[];
    leader?: Team;
  }> {
    try {
      const result = await http().get("/team");
      const data = result.data.data;

      return {
        teams: data.teams,
        leader: data.leader,
      };
    } catch (err) {
      return {
        teams: [],
      };
    }
  }
}
