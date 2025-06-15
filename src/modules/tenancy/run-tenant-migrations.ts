import { DataSource } from 'typeorm';
import { getTenantDatasource, tenantSchemaName } from './tenancy.datasource';
import { Tenant } from '../public/tenants/entities/tenant.entity';

export default async function runMigrationsForAllTenants(
  publicDataSource: DataSource,
) {
  // Fetch all tenants
  const tenants = await publicDataSource.getRepository(Tenant).find();

  for (const tenant of tenants) {
    const tenantDatasource = await getTenantDatasource(tenant.id);

    // Create tenant schema if it does not exist
    await tenantDatasource.query(
      `CREATE SCHEMA IF NOT EXISTS ${tenantSchemaName(tenant.id)}`,
    );

    // Check if there exists any pending migrations for the tenant
    if (await tenantDatasource.showMigrations()) {
      // console.log(`Running migrations for tenant ${tenant.id}...`);
      await tenantDatasource.runMigrations();
      // console.log(`Migrations for tenant ${tenant.id} completed.`);
    }
  }
}
