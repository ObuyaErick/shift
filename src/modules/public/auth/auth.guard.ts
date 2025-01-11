import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Expose } from 'class-transformer';
import { IS_PUBLIC_KEY } from 'src/lib/public.decorator';
import { SESSION_KEY } from './auth.controller';

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

// Granted authority type alias
export type UserRole = GrantedAuthority;

// Current logged in user
export class Principal {
  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  id: string;
}

export class Initials {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phoneNumber: string;
}

// Authentication context
export class Authentication {
  #authorities: Array<GrantedAuthority>;
  #principal: Principal;
  #initials: Initials;

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

  setInitials(firstName: string, lastName: string, phoneNumber: string) {
    this.#initials = { firstName, lastName, phoneNumber };
    return this;
  }

  get authorities() {
    return this.#authorities;
  }

  get principal() {
    return this.#principal;
  }

  get initials() {
    return this.#initials;
  }
}

// Slotting an authentication property
// to hold the authentication context data
declare global {
  namespace Express {
    interface Request {
      authentication?: Authentication;
    }
  }
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 Skipping auth if the requested endpoint is marked as public
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    return this.validateRequest(request);
  }

  async validateRequest(request: Request) {
    const token = this.extractTokenFromHeaderOrCookie(request);

    if (!token) {
      throw new UnauthorizedException(
        'Authentication details not found, you are not signed in.',
      );
    }

    // Extract the payload from the jwt
    const payload = await this.jwtService
      .verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })
      .catch((_err) => {
        throw new UnauthorizedException(
          'Invalid or expired authentication details',
        );
      });

    const email = payload.email;
    // Attempt to find user from the database
    const user = await this.usersService.findByEmail(email).catch((_err) => {
      // Invalid authentication details
      throw new UnauthorizedException(
        'Sorry! User with the provided authentication details could not be verified. Your session may have expired.',
      );
    });

    // Attaching authtentication context (user details) to the request object
    request.authentication = Authentication.build()
      .addAuthorities(...(await this.usersService.getAuthorities(user)))
      .setPrincipal({
        email: user.email,
        id: user.id,
        username: user.username,
      })
      .setInitials(user.firstName, user.lastName, user.phoneNumber);

    return true;
  }

  // Extract the 'Bearer' token from http request headers
  private extractTokenFromHeaderOrCookie(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer'
      ? token
      : request.cookies[SESSION_KEY] || undefined;
  }
}
