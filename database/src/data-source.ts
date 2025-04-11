import { DataSource } from "typeorm"
import * as dotenv from "dotenv";
import entities from '@entities/index'

dotenv.config({ path: '../.env' })

export const AppDataSource = new DataSource({
  type: "mysql",
  // host: "localhost",
  // port: +process.env.DB_PORT,
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  host: "localhost",
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,

  synchronize: true,
  logging: false,
  entities: entities,
  migrations: [],
  subscribers: [],
});
