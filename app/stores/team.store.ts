import { TeamService } from "~/services/team/team.service";
import type { Team } from "~/types/team";

export const useTeamStore = defineStore("team", {
  state(): {
    teams: Team[];
  } {
    return {
      teams: [] as Team[],
    };
  },
  actions: {
    async fetchTeams() {
      if (this.teams.length > 0) {
        return;
      }

      const result = await TeamService.findAll();
      this.setTeams(result);
    },
    setTeams(teams: Team[]) {
      this.teams = teams;
    },
  },
});
