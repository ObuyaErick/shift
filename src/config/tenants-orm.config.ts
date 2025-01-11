import { join } from 'path';
import { publicDatasourceOptions } from './orm.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const tenantedDatasourceOptions: DataSourceOptions = {
  ...publicDatasourceOptions,
  entities: [join(__dirname, './modules/tenanted/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/tenanted/*{.ts,.js}')],
};

export default new DataSource(tenantedDatasourceOptions);
