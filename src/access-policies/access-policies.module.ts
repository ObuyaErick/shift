import { Module } from '@nestjs/common';
import { AccessPoliciesService } from './access-policies.service';
import { AccessPoliciesController } from './access-policies.controller';

@Module({
  controllers: [AccessPoliciesController],
  providers: [AccessPoliciesService],
})
export class AccessPoliciesModule {}
