import { Authentication } from 'src/lib/types';
import { Tenant } from 'src/modules/public/tenants/entities/tenant.entity';

declare global {
  namespace Express {
    interface Request {
      tenant?: Tenant | null;
      session?: JWTSessionPayload | null;
      authentication?: Authentication;
    }
  }
}
