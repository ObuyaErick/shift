import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { StaffModule } from './modules/tenanted/staff/staff.module';
import { StudentsModule } from './modules/tenanted/students/students.module';
import { ParentsModule } from './modules/tenanted/parents/parents.module';
import { ClassroomsModule } from './modules/tenanted/classrooms/classrooms.module';
import { SubjectsModule } from './modules/tenanted/subjects/subjects.module';
import { OtpModule } from './modules/tenanted/otp/otp.module';
import { MailModule } from './mail/mail.module';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TenancyModule } from './modules/tenancy/tenancy.module';
import { TenantsModule } from './modules/public/tenants/tenants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { publicDatasourceOptions } from './config/orm.config';
import { AuthModule } from './modules/tenanted/auth/auth.module';
import { TenancyMiddleware } from './modules/tenancy/tenancy.middleware';
import { ClassroomsController } from './modules/tenanted/classrooms/classrooms.controller';
import { StudentsController } from './modules/tenanted/students/students.controller';
import { StaffController } from './modules/tenanted/staff/staff.controller';
import { ParentsController } from './modules/tenanted/parents/parents.controller';
import { SubjectsController } from './modules/tenanted/subjects/subjects.controller';
import { SubscriptionsModule } from './modules/public/subscriptions/subscriptions.module';
import { AccessPoliciesModule } from './access-policies/access-policies.module';
import { UsersModule } from './modules/tenanted/users/users.module';
import { UsersController } from './modules/tenanted/users/users.controller';
import { SessionController } from './modules/tenanted/auth/session.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(publicDatasourceOptions),
    TenantsModule,
    TenancyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        FRONTEND_HOST: Joi.string().required(),
        MAIL_SERVICE: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().port().default(465),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM: Joi.string().default('"Support Team" <noreply@example.com>'),
        //.default('noreply@example.com'),
        CORS_HOSTS: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${3600 * 24}s`,
          algorithm: 'HS512',
        },
      }),
    }),
    AuthModule,
    StudentsModule,
    StaffModule,
    OtpModule,
    ParentsModule,
    ClassroomsModule,
    SubjectsModule,
    MailModule,
    SubscriptionsModule,
    AccessPoliciesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenancyMiddleware)
      .forRoutes(
        SessionController,
        ClassroomsController,
        StudentsController,
        StaffController,
        ParentsController,
        SubjectsController,
        UsersController,
      );
  }
}
