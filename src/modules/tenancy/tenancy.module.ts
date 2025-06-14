import { ForbiddenException, Global, Module, Scope } from '@nestjs/common';
import { TENANT_CONNECTION } from './tenancy.symbols';
import { Request as ExpressRequest } from 'express';
import { getTenantConnection } from './tenancy.utils';
import { REQUEST } from '@nestjs/core';

const connectionFactory = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  useFactory: (request: ExpressRequest) => {
    const { tenant } = request;

    if (tenant) {
      return getTenantConnection(tenant.id);
    }

    throw new ForbiddenException('You are not logged in.');
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory],
  exports: [TENANT_CONNECTION],
})
export class TenancyModule {}
