import 'module-alias/register';
import { AppDataSource } from "./data-source"
import { Project, Team, TeamMember, TeamStage, User } from '@backend/typeorm';
import getUserSeeds from "./seeds/users";
import getProjectSeeds from './seeds/project';
import getTeamSeeds from './seeds/team';
import getTeamStagesSeeds from './seeds/team-stages';
import getTeamMembersSeeds from './seeds/team-members';

AppDataSource.initialize().then(async () => {
	console.log("Inserting a new user into the database...")
  await setupUsers();
  await setupTeams();
  await setupTeamStages();
  await setupTeamMembers();
  await setupProjects();
}).catch(e => console.log(e));

/**
 * User
 */
export async function setupUsers() {
  const userRepo = AppDataSource.manager.getRepository(User);
  for (const user of await getUserSeeds()) {
    console.log(user);
    await userRepo.save(user);
  }
}

/**
 * Project
 */
export async function setupProjects() {
  const projectRepo = AppDataSource.manager.getRepository(Project);
  for (const project of getProjectSeeds()) {
    console.log(project);
    await projectRepo.save(project);
  }
}

/**
 * Teams
 */
export async function setupTeams() {
  const teamRepo = AppDataSource.manager.getRepository(Team);
  for (const team of getTeamSeeds()) {
    console.log(team);
    await teamRepo.save(team);
  }
}

/**
 * Team Stages
 */
export async function setupTeamStages() {
  const stageRepo = AppDataSource.manager.getRepository(TeamStage);
  for (const stage of getTeamStagesSeeds()) {
    console.log(stage);
    await stageRepo.save(stage);
  }
}

/**
 * Team Member
 */
export async function setupTeamMembers() {
  const memberRepo = AppDataSource.manager.getRepository(TeamMember);
  for (const member of getTeamMembersSeeds()) {
    console.log(member);
    await memberRepo.save(member);
  }
}
