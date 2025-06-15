import { join } from 'path';
import { publicDatasourceOptions } from './orm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const tenantedMigrationsDatasourceOptions: DataSourceOptions &
  SeederOptions = {
  ...(publicDatasourceOptions as PostgresConnectionOptions),
  extra: {
    max: 1,
  },
  schema: 'tenancy_dev_migrations',
  entities: [join(__dirname, '../modules/tenanted/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/tenanted/*{.ts,.js}')],
  seeds: [join(__dirname, '../seeds/tenanted/**/*.seed{.ts,.js}')],
};

export default new DataSource(tenantedMigrationsDatasourceOptions);
