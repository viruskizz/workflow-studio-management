import 'module-alias/register';
import { AppDataSource } from "./data-source"
<<<<<<< HEAD
import { Project, Team, TeamStage, User } from '@backend/typeorm';
import getUserSeeds from "./seeds/users";
import getProjectSeeds from './seeds/project';
import getTeamSeeds from './seeds/team';
import getTeamStagesSeeds from './seeds/team-stages';
=======
import { Project, User } from '@backend/typeorm';
import getUserSeeds from "./seeds/users";
import getProjectSeeds from './seeds/project';
>>>>>>> c24f244 (display users from database)

AppDataSource.initialize().then(async () => {
	console.log("Inserting a new user into the database...")
  await setupUsers();
<<<<<<< HEAD
  await setupTeams();
  await setupTeamStages();
=======
>>>>>>> c24f244 (display users from database)
  await setupProjects();
}).catch(e => console.log(e));


export async function setupUsers() {
  const userRepo = AppDataSource.manager.getRepository(User);
  for (const user of await getUserSeeds()) {
    console.log(user);
    await userRepo.save(user);
  }
}

export async function setupProjects() {
  const projectRepo = AppDataSource.manager.getRepository(Project);
  for (const project of getProjectSeeds()) {
    console.log(project);
    await projectRepo.save(project);
  }
}

<<<<<<< HEAD
export async function setupTeams() {
  const teamRepo = AppDataSource.manager.getRepository(Team);
  for (const team of getTeamSeeds()) {
    console.log(team);
    await teamRepo.save(team);
  }
}

export async function setupTeamStages() {
  const stageRepo = AppDataSource.manager.getRepository(TeamStage);
  for (const stage of getTeamStagesSeeds()) {
    console.log(stage);
    await stageRepo.save(stage);
  }
}

=======
>>>>>>> c24f244 (display users from database)
