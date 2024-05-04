import 'module-alias/register';
import { AppDataSource } from "./data-source"
import { Project, User } from '@backend/typeorm';
import getUserSeeds from "./seeds/users";
import getProjectSeeds from './seeds/project';

AppDataSource.initialize().then(async () => {
	console.log("Inserting a new user into the database...")
  await setupUsers();
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

