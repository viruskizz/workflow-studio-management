import { Team, User } from "@backend/typeorm";

const teams: Partial<Team>[] = [
  {
    name: 'Good Geek',
    leaderId: 1,
  },
  {
    name: 'Square Enix',
    leaderId: 2,
  },
  {
    name: 'Bandai Namco',
    leaderId: 3,
  }
];

const getTeamSeeds = () => {
  return teams;
}

export default getTeamSeeds;