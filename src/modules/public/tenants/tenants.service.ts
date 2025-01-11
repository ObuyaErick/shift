import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { DataSource, Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getTenantConnection } from 'src/modules/tenancy/tenancy.utils';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = await this.dataSource
      .getRepository(Tenant)
      .save(createTenantDto);

    const sanitizedTenantId = tenant.id.replaceAll('-', '_').trim();
    const schemaName = `tenant_${sanitizedTenantId}`;

    const tenantConnection = await getTenantConnection(sanitizedTenantId);

    await tenantConnection.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

    await tenantConnection.runMigrations();

    return tenant;
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.find();
  }
}
