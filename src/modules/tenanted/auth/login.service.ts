import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { PasswordService } from 'src/passwords/password.service';
import { TenantsService } from '../../public/tenants/tenants.service';
import { getTenantDatasource } from 'src/modules/tenancy/tenancy.datasource';
import { User } from '../users/entities/user.entity';
import { JWTSessionPayload } from './auth.types';
import { APIResponse } from 'src/typings/api.response';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tenantsService: TenantsService,
  ) {}

  async signIn({
    username,
    password,
    tenant,
  }: SignInDto): Promise<APIResponse<{ accessToken: string }>> {
    // Attempt to find tenant by username
    const { data: _tenant } = await this.tenantsService.find({
      username: tenant,
    });

    // Find user
    const _user = await getTenantDatasource(_tenant.id).then((ds) =>
      ds.getRepository(User).findOne({ where: { username } }),
    );

    if (!_user) {
      throw new NotFoundException('User not found');
    }

    if (!PasswordService.verifyPassword(password, _user.password)) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload: JWTSessionPayload = {
      sub: _user.id,
      email: _user.email,
      username: _user.username,
      tenant: { id: _tenant.id, username: _tenant.username },
    };

    return {
      data: {
        accessToken: await this.jwtService.signAsync(payload, {}),
      },
      message: 'Signed in successfully.',
    };
  }
}
