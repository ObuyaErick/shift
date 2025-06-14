import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { every } from 'lodash';
import { Observable } from 'rxjs';
import { REQUIRED_SUBSCRIPTION_FEATURES_KEY } from 'src/lib/decorators/required-features.decorator';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredFeatures = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_SUBSCRIPTION_FEATURES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredFeatures) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const tenant = request.tenant;

    if (!tenant || !tenant.subscriptionPlan) {
      throw new ForbiddenException(
        'Access denied: No subscription plan found.',
      );
    }

    const tenantFeatures = tenant.subscriptionPlan.features;

    const hasAccess = every(requiredFeatures, (feature) =>
      tenantFeatures.find(
        (tenantFeatureSubscription) =>
          tenantFeatureSubscription.name === feature,
      ),
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'Access denied: Insufficient subscription privileges.',
      );
    }

    return true;
  }
}
