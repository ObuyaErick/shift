import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { TypeOrmFilter } from './filters/typeorm.filter';
import { ExcludeSensitiveDataInterceptor } from './interceptors/interceptor.sensitive-data';
import runMigrationsForAllTenants from './modules/tenancy/run-tenant-migrations';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --------------------------------------------------------------------------------------------------
  // Public schema datasource
  const publicDataSource = app.get(DataSource);

  // await publicDataSource.query(`CREATE SCHEMA IF NOT EXISTS tenancy_dev_migrations`);

  // Run public migrations if one is pending
  // if (await publicDataSource.showMigrations()) {
  //   await publicDataSource.runMigrations();
  // }

  await runMigrationsForAllTenants(publicDataSource);

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
