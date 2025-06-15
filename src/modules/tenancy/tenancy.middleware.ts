import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantsService } from '../public/tenants/tenants.service';
import { Authentication, JWTSessionPayload } from 'src/auth.types';
import { SESSION_KEY } from 'src/auth.types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getTenantDatasource } from './tenancy.datasource';
import { User } from '../tenanted/users/entities/user.entity';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    await this.validateRequest(req);

    next();
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
      .verifyAsync<JWTSessionPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })
      .catch((_err) => {
        throw new UnauthorizedException(
          'Invalid or expired authentication details',
        );
      });

    const tenant = await this.tenantsService.find({
      id: payload.tenant.id,
    });
    const user = await getTenantDatasource(tenant.id)
      .then((connection) =>
        connection.getRepository(User).findOneByOrFail({ id: payload.sub }),
      )
      .catch((_error) => {
        throw new UnauthorizedException(
          'User with the provided authentication details could not be verified',
        );
      });

    // Attach tenant id
    request.tenant = tenant;

    // Attaching authtentication context (user details) to the request object
    request.authentication = Authentication.build()
      .addAuthorities()
      .setPrincipal({
        id: user.id,
        username: user.username,
      })
      .setTenant(tenant);

    return true;
  }

  // Extract the 'Bearer' token from http request headers
  private extractTokenFromHeaderOrCookie(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer'
      ? token
      : request.cookies
        ? request.cookies[SESSION_KEY]
        : undefined;
  }
}
