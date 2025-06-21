import { Expose } from 'class-transformer';
import {
  Tenant,
  TenantDetails,
} from 'src/modules/public/tenants/entities/tenant.entity';
import { User } from '../users/entities/user.entity';
import { OmitType } from '@nestjs/mapped-types';

export const SESSION_KEY = 'session' as const;

export interface JWTSessionPayload {
  sub: string;
  email?: string | null;
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
export class Principal extends OmitType(User, [
  'password',
  'setPassword',
  'createdAt',
  'updatedAt',
]) {}

// Authentication context
export class Authentication {
  #authorities: Array<GrantedAuthority>;
  #principal: Principal;
  #tenant: TenantDetails | null;

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
    const { id, username, name, email, address, logo } = tenant;
    this.#tenant = { id, username, name, email, address, logo };
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
