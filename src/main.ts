import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { getTenantConnection } from './modules/tenancy/tenancy.utils';
import { Tenant } from './modules/public/tenants/entities/tenant.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --------------------------------------------------------------------------------------------------
  // Public schema datasource
  const publicDataSource = app.get(DataSource);

  // Run public migrations if one is pending
  if (await publicDataSource.showMigrations()) {
    await publicDataSource.runMigrations();
  }

  console.log('Pending Migrations: ', await publicDataSource.showMigrations());

  // // Fetch all tenants
  // const tenants = await publicDataSource.getRepository(Tenant).find();

  // for (const tenant of tenants) {
  //   const tenantId = tenant.id.replaceAll('-', '_');
  //   const tenantConnection = await getTenantConnection(tenant.id);

  //   // Create tenant schema if it does not exist
  //   await tenantConnection.query(
  //     `CREATE SCHEMA IF NOT EXISTS tenant_${tenantId}`,
  //   );

  //   // Check if there exists any pending migrations for the tenant
  //   if (await tenantConnection.showMigrations()) {
  //     // console.log(`Running migrations for tenant ${tenant.id}...`);
  //     await tenantConnection.runMigrations();
  //     // console.log(`Migrations for tenant ${tenant.id} completed.`);
  //   }
  // }

  // --------------------------------------------------------------------------------------------------

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', { infer: true });
  const frontEndHost = configService.get<string>('FRONTEND_HOST');

  app.enableCors({
    origin: frontEndHost,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(port, '0.0.0.0');
}
bootstrap();
