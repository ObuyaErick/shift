import { SetMetadata } from '@nestjs/common';

export const REQUIRED_SUBSCRIPTION_FEATURES_KEY =
  'required_subscription_features';

export const RequiredFeatures = (...features: string[]) =>
  SetMetadata(REQUIRED_SUBSCRIPTION_FEATURES_KEY, features);
