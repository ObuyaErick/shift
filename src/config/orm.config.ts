import { join } from 'path';
import { SnakeNamingStrategy } from 'src/lib/snake-naming.strategy';
import { DataSource, DataSourceOptions } from 'typeorm';

export const publicDatasourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'user_multitenant',
  password: 'password_multitenant',
  database: 'db_multitenant',
  namingStrategy: new SnakeNamingStrategy(),
  // logging: true,
  synchronize: false,
  migrationsRun: false,
  entities: [join(__dirname,'./modules/public/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/public/*{.ts,.js}')],
};

export default new DataSource(publicDatasourceOptions);
