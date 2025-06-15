import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Crud } from 'src/db/crud';
import {
  getTenantDatasource,
  tenantSchemaName,
} from 'src/modules/tenancy/tenancy.datasource';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
  ) {}
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantsRepository.save(createTenantDto);

    const schemaName = tenantSchemaName(tenant.id);

    const tenantDatasource = await getTenantDatasource(tenant.id);

    await tenantDatasource.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

    await tenantDatasource.runMigrations();

    return tenant;
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.find();
  }

  find(where: FindOptionsWhere<Tenant>): Promise<Tenant> {
    return Crud.find(this.tenantsRepository, where);
  }
}
