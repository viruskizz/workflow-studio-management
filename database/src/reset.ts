import 'module-alias/register';
import { AppDataSource } from "./data-source";

AppDataSource.initialize().then(async () => {
	console.log("Reset the database, remove all data in every table...");
	const tables = ['tasks', 'projects', 'teams', 'users']
	for (const table of tables) {
		console.log(`Droping table ${table}`)
		await AppDataSource.query(`DROP TABLE ${table};`);
	}
	console.log('== Finish ==');
}).catch(e => console.log(e));