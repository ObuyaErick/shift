import { join } from 'path';
import { publicDatasourceOptions } from './orm.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export const tenantedDatasourceOptions: DataSourceOptions & SeederOptions = {
  ...publicDatasourceOptions,
  entities: [join(__dirname, '../modules/tenanted/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/tenanted/*{.ts,.js}')],
  seeds: [join(__dirname, '../seeds/tenanted/**/*.seed{.ts,.js}')],
};

export default new DataSource(tenantedDatasourceOptions);
