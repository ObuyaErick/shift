import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getTenantConnection } from 'src/modules/tenancy/tenancy.utils';
import { PasswordService } from 'src/lib/password.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
  ) {}
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantsRepository.save({
      ...createTenantDto,
      password: PasswordService.hashedPassword(createTenantDto.password),
    });

    const sanitizedTenantId = tenant.id.replaceAll('-', '_').trim();
    const schemaName = `tenant_${sanitizedTenantId}`;

    const tenantConnection = await getTenantConnection(tenant.id);
    tenantConnection.transaction;

    await tenantConnection.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

    await tenantConnection.runMigrations();

    return tenant;
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.find();
  }

  find(where: FindOptionsWhere<Tenant>): Promise<Tenant> {
    return this.tenantsRepository.findOneByOrFail(where);
  }
}
