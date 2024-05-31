import entities from '@backend/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from './envconfig';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const dbDefaultConfig: DataSourceOptions | SqliteConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: '424242',
  database: 'workflow',
  entities: entities,
  synchronize: true,
};

export const appDataSource = new DataSource({
  type: dbDefaultConfig.type,
  host: env.DB_HOST || dbDefaultConfig.host,
  port: +env.DB_PORT || dbDefaultConfig.port,
  username: env.DB_USERNAME || dbDefaultConfig.username,
  password: env.DB_PASSWORD || dbDefaultConfig.password,
  database: env.DB_NAME || dbDefaultConfig.database,
  entities: dbDefaultConfig.entities,
  synchronize: dbDefaultConfig.synchronize,
});
