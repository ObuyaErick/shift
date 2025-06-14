import { join } from 'path';
import { SnakeNamingStrategy } from 'src/lib/snake-naming.strategy';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export const publicDatasourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
  synchronize: false,
  migrationsRun: false,
  entities: [join(__dirname, '../modules/public/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/public/*{.ts,.js}')],
  seeds: [join(__dirname, '../seeds/public/**/*.seed{.ts,.js}')],
};

export default new DataSource(publicDatasourceOptions);
