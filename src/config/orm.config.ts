import { join } from 'path';
import { SnakeNamingStrategy } from 'src/db/snake-naming.strategy';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const MAX_CONNECTIONS = 90;
const MAX_PUBLIC_CONNECTIONS = 10;
export const MAX_TENANT_DATA_SOURCES = MAX_CONNECTIONS - MAX_PUBLIC_CONNECTIONS;

export const TENANT_SCHEMA_PREFIX = 'tenant_';

export const publicDatasourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  namingStrategy: new SnakeNamingStrategy(),
  // logging: true,
  synchronize: false,
  migrationsRun: false,
  extra: {
    max: MAX_PUBLIC_CONNECTIONS,
  },
  entities: [join(__dirname, '../modules/public/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/public/*{.ts,.js}')],
  seeds: [join(__dirname, '../seeds/public/**/*.seed{.ts,.js}')],
};

export default new DataSource(publicDatasourceOptions);
