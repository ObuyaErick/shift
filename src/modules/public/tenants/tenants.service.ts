import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant, TenantDetails } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Crud } from 'src/db/crud';
import {
  getTenantDatasource,
  tenantSchemaName,
} from 'src/modules/tenancy/tenancy.datasource';
import { APIResponse } from 'src/typings/api.response';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
  ) {}
  async create(
    createTenantDto: CreateTenantDto,
  ): Promise<APIResponse<TenantDetails>> {
    const tenant = await this.tenantsRepository.save(createTenantDto);

    const schemaName = tenantSchemaName(tenant.id);

    const tenantDatasource = await getTenantDatasource(tenant.id);

    await tenantDatasource.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

    await tenantDatasource.runMigrations();

    return {
      data: tenant,
      message: 'Tenant created successfully',
    };
  }

  async findAll(search?: string): Promise<APIResponse<TenantDetails[]>> {
    return {
      // data: await this.tenantsRepository.find(),
      data: !search
        ? dummyTenants()
        : dummyTenants().filter((t) => {
            const s = search?.toLowerCase() ?? '';
            return (
              t.name.toLowerCase().includes(s) ||
              t.username.toLowerCase().includes(s)
            );
          }),
      message: 'Tenants fetched successfully',
    };
  }

  async find(
    where: FindOptionsWhere<Tenant>,
  ): Promise<APIResponse<TenantDetails>> {
    return {
      data: await Crud.find(this.tenantsRepository, where),
      message: 'Tenant fetched successfully',
    };
  }
}

function dummyTenants() {
  return [
    {
      id: 'e89670e1-e119-40dd-b929-c8f28e55123c',
      createdAt: '2025-06-16T04:35:24.032Z',
      updatedAt: '2025-06-16T04:35:24.032Z',
      name: 'Victoria High School',
      username: 'victoria',
      email: 'victoria@lernivo.com',
      address: 'P.O. Box 335, Homabay.',
      logo: '',
    },
    {
      id: 'a71539c5-9340-41a6-96f5-2c0a54e0d2de',
      createdAt: '2025-06-16T05:10:11.001Z',
      updatedAt: '2025-06-16T05:10:11.001Z',
      name: 'Moi Forces Academy',
      username: 'moiforces',
      email: 'moiforces@lernivo.com',
      address: 'P.O. Box 101, Nairobi.',
      logo: '',
    },
    {
      id: 'b5d3b507-b876-499a-a093-7de303b92b6e',
      createdAt: '2025-06-16T05:20:19.700Z',
      updatedAt: '2025-06-16T05:20:19.700Z',
      name: 'Maseno School',
      username: 'maseno',
      email: 'maseno@lernivo.com',
      address: 'P.O. Box 246, Kisumu.',
      logo: '',
    },
    {
      id: 'd1f62ac8-884c-4dd3-a7d0-71a0f65b8b93',
      createdAt: '2025-06-16T05:25:41.002Z',
      updatedAt: '2025-06-16T05:25:41.002Z',
      name: 'Alliance High School',
      username: 'alliance',
      email: 'alliance@lernivo.com',
      address: 'P.O. Box 101, Kikuyu.',
      logo: '',
    },
    {
      id: '3fdcb2e2-9c3a-4cf1-a15a-31e2bc9a7b4a',
      createdAt: '2025-06-16T05:30:01.790Z',
      updatedAt: '2025-06-16T05:30:01.790Z',
      name: 'Kenya High School',
      username: 'kenyahigh',
      email: 'kenyahigh@lernivo.com',
      address: 'P.O. Box 312, Nairobi.',
      logo: '',
    },
    {
      id: '73bd091c-d1b6-48b3-b735-65eacc5c4064',
      createdAt: '2025-06-16T05:35:12.134Z',
      updatedAt: '2025-06-16T05:35:12.134Z',
      name: 'Kisii School',
      username: 'kisii',
      email: 'kisii@lernivo.com',
      address: 'P.O. Box 421, Kisii.',
      logo: '',
    },
    {
      id: '504f5a38-321c-44f2-b0f0-48a7f8f778d7',
      createdAt: '2025-06-16T05:40:44.590Z',
      updatedAt: '2025-06-16T05:40:44.590Z',
      name: 'Precious Blood Riruta',
      username: 'preciousblood',
      email: 'preciousblood@lernivo.com',
      address: 'P.O. Box 528, Nairobi.',
      logo: '',
    },
    {
      id: '7e9d9b36-29a6-4c0c-a46e-9e02449f8592',
      createdAt: '2025-06-16T05:45:05.870Z',
      updatedAt: '2025-06-16T05:45:05.870Z',
      name: "Mang'u High School",
      username: 'mangu',
      email: 'mangu@lernivo.com',
      address: 'P.O. Box 412, Thika.',
      logo: '',
    },
    {
      id: '9a2ec70d-8d61-452c-a928-e4db6ef60c37',
      createdAt: '2025-06-16T05:50:10.010Z',
      updatedAt: '2025-06-16T05:50:10.010Z',
      name: 'Starehe Boys Centre',
      username: 'starehe',
      email: 'starehe@lernivo.com',
      address: 'P.O. Box 1234, Nairobi.',
      logo: '',
    },
    {
      id: '0bd1fa7a-6045-4e45-8dfc-32be99bfb932',
      createdAt: '2025-06-16T05:55:21.320Z',
      updatedAt: '2025-06-16T05:55:21.320Z',
      name: 'Pangani Girls High School',
      username: 'pangani',
      email: 'pangani@lernivo.com',
      address: 'P.O. Box 456, Nairobi.',
      logo: '',
    },
    {
      id: 'fc91ee83-558f-4f31-967e-90a338f9e1b9',
      createdAt: '2025-06-16T06:00:35.000Z',
      updatedAt: '2025-06-16T06:00:35.000Z',
      name: 'Nyeri High School',
      username: 'nyeri',
      email: 'nyeri@lernivo.com',
      address: 'P.O. Box 789, Nyeri.',
      logo: '',
    },
    {
      id: 'cf16772c-69a2-4dc6-9bb1-06bc429a1e61',
      createdAt: '2025-06-16T06:05:50.556Z',
      updatedAt: '2025-06-16T06:05:50.556Z',
      name: 'Kapsabet Boys High School',
      username: 'kapsabet',
      email: 'kapsabet@lernivo.com',
      address: 'P.O. Box 101, Kapsabet.',
      logo: '',
    },
    {
      id: '7f0f8719-fbe0-4df6-8e95-2b3b6d6c8d52',
      createdAt: '2025-06-16T06:10:12.700Z',
      updatedAt: '2025-06-16T06:10:12.700Z',
      name: 'Friends School Kamusinga',
      username: 'kamusinga',
      email: 'kamusinga@lernivo.com',
      address: 'P.O. Box 999, Bungoma.',
      logo: '',
    },
  ];
}
