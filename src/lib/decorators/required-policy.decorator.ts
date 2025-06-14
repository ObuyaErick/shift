import { Subject as CaslSubject } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';

export interface RequiredPolicy<A extends string, S extends CaslSubject> {
  action: A;
  subject: S;
}

export const REQUIRED_POLICIES_KEY = 'required_policies';

export const CheckPolicies = <A extends string, S extends CaslSubject>(
  ...policies: RequiredPolicy<A, S>[]
) => SetMetadata(REQUIRED_POLICIES_KEY, policies);
