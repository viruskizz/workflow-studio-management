import 'module-alias/register';
import { AppDataSource } from "./data-source"
import { User } from '@entities/user.entity'
import getUserSeed from "./seeds/users";

AppDataSource.initialize().then(async () => {
	console.log("Inserting a new user into the database...")
  await setupUser();
}).catch(e => console.log(e));


export async function setupUser() {
  const userRepo = AppDataSource.manager.getRepository(User);
  for (const user of await getUserSeed()) {
    await userRepo.save(user);
  }
}
