import { Subject as CaslSubject } from '@casl/ability';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { CaslAbilityFactory } from 'src/casl/casl-ability-factory';
import {
  REQUIRED_POLICIES_KEY,
  RequiredPolicy,
} from 'src/decorators/required-policy.decorator';

@Injectable()
export class AccessPoliciesGuard<A extends string, S extends CaslSubject>
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory<A, S>,
  ) {}

  /**
   * Main method that determines if the current request can proceed based on defined policies.
   * @param context - The execution context, containing the request and response objects.
   * @returns A boolean indicating whether the request is allowed.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve policies defined for the route handler and class
    const policies =
      this.reflector.getAllAndOverride<RequiredPolicy<A, S>[]>(
        REQUIRED_POLICIES_KEY,
        [context.getHandler(), context.getClass()],
      ) || [];
    if (isEmpty(policies)) {
      return true;
    }
    return true;
  }
}
