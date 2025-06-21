import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { APIResponse } from 'src/typings/api.response';
import { TenantDetails } from './entities/tenant.entity';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async create(
    @Body()
    createTenantDto: CreateTenantDto,
  ): Promise<APIResponse<TenantDetails>> {
    return await this.tenantsService.create(createTenantDto);
  }

  @Get()
  async findAll(
    @Query('q') search: string,
  ): Promise<APIResponse<TenantDetails[]>> {
    return await this.tenantsService.findAll(search);
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new BadRequestException('Invalid tenant ID format'),
      }),
    )
    id: string,
  ): Promise<APIResponse<TenantDetails>> {
    return await this.tenantsService.find({ id });
  }
}
