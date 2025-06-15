import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { TypeOrmFilter } from './filters/typeorm.filter';
import { ExcludeSensitiveDataInterceptor } from './interceptors/interceptor.sensitive-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --------------------------------------------------------------------------------------------------
  // Public schema datasource
  const publicDataSource = app.get(DataSource);

  // await publicDataSource.query(`CREATE SCHEMA IF NOT EXISTS tenancy_dev_migrations`);

  // Run public migrations if one is pending
  if (await publicDataSource.showMigrations()) {
    // await publicDataSource.runMigrations();
  }

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

  // Configure cross origin resource sharing
  app.enableCors({
    origin: String(configService.get('CORS_HOSTS'))
      .split(',')
      .map((h) => h.trim()),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Support for cookies
  app.use(cookieParser());

  // A global resource not found exception filter
  app.useGlobalFilters(new TypeOrmFilter());

  // Glodal sensitive data interceptor
  app.useGlobalInterceptors(new ExcludeSensitiveDataInterceptor());

  await app.listen(port, '0.0.0.0');
}
bootstrap();
