import { TenantDetails } from 'src/modules/public/tenants/entities/tenant.entity';
import {
  Authentication,
  JWTSessionPayload,
} from 'src/modules/tenanted/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantDetails | null;
      session?: JWTSessionPayload | null;
      authentication?: Authentication | null;
    }
  }
}
