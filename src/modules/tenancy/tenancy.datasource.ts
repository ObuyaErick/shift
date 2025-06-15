import { TENANT_SCHEMA_PREFIX } from 'src/config/orm.config';
import { DataSource } from 'typeorm';
import { datasourceManager } from './tenancy.datasource.manager';
import { tenantedDatasourceOptions } from 'src/config/tenants-orm.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export async function getTenantDatasource(
  tenantId: string,
): Promise<DataSource> {
  const schema = tenantSchemaName(tenantId);

  return datasourceManager.getOrCreate(schema, async () => {
    const source = new DataSource({
      ...(tenantedDatasourceOptions as PostgresConnectionOptions),
      name: schema,
      schema,
    });

    return await source.initialize();
  });
}

export function tenantSchemaName(tenantId: string) {
  const _tenantId = tenantId.replaceAll('-', '_');
  return `${TENANT_SCHEMA_PREFIX}${_tenantId}`;
}
