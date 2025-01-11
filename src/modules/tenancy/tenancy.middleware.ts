import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Tenant } from '../public/tenants/entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { XTenantIdDto } from './tenancy.dto';
import { validateSync } from 'class-validator';

const TENANT_HEADER = 'x-tenant-id';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const xTenantId = req.headers[TENANT_HEADER] as string;

    if (xTenantId) {
      const tenantDto = plainToInstance(XTenantIdDto, { value: xTenantId });
      const errors = validateSync(tenantDto);

      if (
        errors.length < 1 &&
        (await this.tenantRepository.existsBy({ id: xTenantId }))
      ) {
        req.tenantId = xTenantId?.toString() || null;
      } else {
        throw new UnauthorizedException('Invalid authentication details');
      }
    } else {
      throw new UnauthorizedException('Invalid authentication details');
    }

    next();
  }
}
