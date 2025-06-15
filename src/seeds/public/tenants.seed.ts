import { CreateTenantDto } from 'src/modules/public/tenants/dto/create-tenant.dto';
import { Tenant } from 'src/modules/public/tenants/entities/tenant.entity';
import {
  getTenantDatasource,
  tenantSchemaName,
} from 'src/modules/tenancy/tenancy.datasource';
import { CreateUserDto } from 'src/modules/tenanted/users/dto/create-user.dto';
import {
  User,
  UserRole,
} from 'src/modules/tenanted/users/entities/user.entity';
import { PasswordService } from 'src/passwords/password.service';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  track?: boolean | undefined = true;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('Seeding Tenants');
    const transaction = await dataSource.transaction(async (entityManager) => {
      const createTenantDto: CreateTenantDto = {
        name: 'Victoria',
        username: 'victoria',
        email: 'victoria@lernivo.com',
        address: 'P.O. Box 335, Homabay.',
        logo: '',
        password: PasswordService.hashedPassword('victoria'),
      };
      const tenantRepository = entityManager.getRepository(Tenant);
      entityManager.query('DELETE FROM tenants');
      const tenant = await tenantRepository.save(createTenantDto);

      const tenantDatasource = await getTenantDatasource(tenant.id);

      const schemaName = tenantSchemaName(tenant.id);

      await tenantDatasource.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

      if (await tenantDatasource.showMigrations()) {
        tenantDatasource.runMigrations();
      }

      const transaction2 = await tenantDatasource.transaction(
        async (entityManager2) => {
          const userRepository = entityManager2.getRepository(User);
          entityManager2.query(`DELETE FROM "${schemaName}"."users"`);
          const createUserDto: CreateUserDto = {
            username: tenant.username,
            email: tenant.email,
            password: createTenantDto.password,
            role: UserRole.school,
          };
          // Create school user
          const user = await userRepository.save(createUserDto);
        },
      );
    });

    console.log(`Seeded tenants`);
  }
}
