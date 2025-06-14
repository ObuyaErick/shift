import { PasswordService } from 'src/lib/password.service';
import { CreateTenantDto } from 'src/modules/public/tenants/dto/create-tenant.dto';
import { Tenant } from 'src/modules/public/tenants/entities/tenant.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  track?: boolean | undefined = true;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('Seeding Tenants');
    const tenant: CreateTenantDto = {
      name: 'Victoria',
      username: 'victoria',
      email: 'victoria@lernivo.com',
      address: 'P.O. Box 335, Homabay.',
      logo: '',
      password: PasswordService.hashedPassword('victoria'),
    };
    const tenantRepository = dataSource.getRepository(Tenant);
    const result = await tenantRepository.insert(tenant);
    console.log(`Seeded ${result.identifiers.length} tenant(s)`);
  }
}
