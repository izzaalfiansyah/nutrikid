import { TeamService } from "~/services/team/team.service";
import type { Team } from "~/types/team";

export const useTeamStore = defineStore("team", {
  state(): {
    teams: Team[];
    leader?: Team;
  } {
    return {
      teams: [] as Team[],
      leader: undefined,
    };
  },
  actions: {
    async fetchTeams() {
      if (this.teams.length > 0) {
        return;
      }

      const result = await TeamService.findAll();
      this.setTeams(result.teams, result.leader);
    },
    setTeams(teams: Team[], leader?: Team) {
      this.teams = teams;

      if (leader) {
        this.leader = leader;
      }
    },
  },
});
