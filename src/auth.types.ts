import { Expose } from 'class-transformer';
import { Tenant } from './modules/public/tenants/entities/tenant.entity';

export const SESSION_KEY = 'session' as const;

export interface JWTSessionPayload {
  sub: string;
  username: string;
  tenant: { id: string; username: string };
}

// Roles
export class GrantedAuthority {
  @Expose()
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

// Current logged in user
export class Principal {
  @Expose()
  username: string;

  @Expose()
  id: string;
}

// Authentication context
export class Authentication {
  #authorities: Array<GrantedAuthority>;
  #principal: Principal;
  #tenant: Tenant | null;

  private constructor() {
    this.#authorities = [];
  }

  static build(): Authentication {
    return new Authentication();
  }

  addAuthorities(...authorities: Array<GrantedAuthority>): Authentication {
    this.#authorities = this.#authorities.concat(authorities);
    return this;
  }

  setPrincipal(principal: Principal): Authentication {
    this.#principal = principal;
    return this;
  }

  setTenant(tenant: Tenant): Authentication {
    this.#tenant = tenant;
    return this;
  }

  get authorities() {
    return this.#authorities;
  }

  get principal() {
    return this.#principal;
  }

  get tenant() {
    return this.#tenant;
  }
}
