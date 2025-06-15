import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { MailService } from 'src/mail/mail.service';
import { PasswordService } from 'src/passwords/password.service';
import { TenantsService } from '../../public/tenants/tenants.service';
import { getTenantDatasource } from 'src/modules/tenancy/tenancy.datasource';
import { User } from '../users/entities/user.entity';
import { JWTSessionPayload } from './auth.types';
import { PasswordResetDto } from './dto/password-reset.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { OtpService } from '../otp/otp.service';
import { UsersService } from '../users/users.service';
import { DataSource } from 'typeorm';
import { TENANT_DATASOURCE } from 'src/modules/tenancy/tenancy.symbols';
import { OTP } from '../otp/otp.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly tenantsService: TenantsService,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    @Inject(TENANT_DATASOURCE)
    private readonly tenantDataSource: DataSource,
  ) {}

  async signIn({ username, password, tenant }: SignInDto) {
    // Attempt to find tenant by username
    const _tenant = await this.tenantsService.find({
      username: tenant,
    });

    if (!_tenant) {
      throw new NotFoundException('Tenant not found');
    }

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
      access_token: await this.jwtService.signAsync(payload, {}),
    };
  }

  async requestPasswordReset({ username }: PasswordResetRequestDto) {
    const user = await this.usersService.findByUsernameOrEmail(username);

    if (!user.email) {
      throw new BadRequestException('No email associated with this account.');
    }

    const host = this.configService.getOrThrow<string>('FRONTEND_HOST');
    const path = '/reset-password';
    const url = new URL(path, host).toString();

    return this.tenantDataSource.transaction(async (entityManager) => {
      const otp = await this.otpService.create(user.id, entityManager);

      // Send mail
      await this.mailService.sendPasswordResetRequestMail({
        options: {
          subject: 'Reset your password',
          to: user.email,
          template: 'password-reset',
        },
        context: {
          otp: otp.value,
          uiURL: url,
          name: user.username,
        },
      });

      return {
        message:
          'Please follow the instructions sent to your email to reset your password.',
      };
    });
  }

  async passwordReset({ newPassword, otp }: PasswordResetDto) {
    return this.tenantDataSource.transaction(async (entityManager) => {
      const oneTimePassword = await this.otpService.verify(otp, entityManager);

      const user = oneTimePassword.user;

      await entityManager.getRepository(User).update(
        {
          id: user.id,
        },
        {
          password: PasswordService.hashedPassword(newPassword),
        },
      );

      return {
        message: 'You have successfully reset your password.',
      };
    });
  }
}
