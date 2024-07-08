import { TeamMember } from "@backend/typeorm";

const stages: Partial<TeamMember>[] = [
  {
    teamId: 1,
    userId: 1
  },
  {
    teamId: 1,
    userId: 2
  },
  {
    teamId: 1,
    userId: 3
  },
];

const getTeamMembersSeeds = () => {
  return stages;
}

export default getTeamMembersSeeds;