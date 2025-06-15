import { ForbiddenException, Global, Module, Scope } from '@nestjs/common';
import { TENANT_DATASOURCE } from './tenancy.symbols';
import { Request as ExpressRequest } from 'express';
import { REQUEST } from '@nestjs/core';
import { getTenantDatasource } from './tenancy.datasource';

const connectionFactory = {
  provide: TENANT_DATASOURCE,
  scope: Scope.REQUEST,
  useFactory: (request: ExpressRequest) => {
    const { tenant } = request;

    if (tenant) {
      return getTenantDatasource(tenant.id);
    }

    throw new ForbiddenException('You are not logged in.');
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory],
  exports: [TENANT_DATASOURCE],
})
export class TenancyModule {}
