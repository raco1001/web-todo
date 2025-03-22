import { DataSource } from 'typeorm';
import { Users } from '../entities/Users';
import { Teams } from '../entities/Teams';
import { TeamUsers } from '../entities/TeamUsers';
import { Todolists } from '../entities/Todolists';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'mariadb_service',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'todolist',
  entities: [Users, Teams, TeamUsers, Todolists],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
});
