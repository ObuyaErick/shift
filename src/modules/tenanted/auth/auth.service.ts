import {
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
import { JWTSessionPayload } from 'src/auth.types';
import { getTenantDatasource } from 'src/modules/tenancy/tenancy.datasource';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly tenantsService: TenantsService,
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
      username: _user.username,
      tenant: { id: _tenant.id, username: _tenant.username },
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {}),
    };
  }

  // async passwordResetRequest({ identity }: PasswordResetRequestDto) {
  //   const user =
  //     await this.usersService.findByUsernameOrEmailOrPhoneNumber(identity);

  //   const host = this.configService.get<string>('VUE_FRONTEND');
  //   const path = '/reset-password';
  //   const url = `${host}${path}`;

  //   return this.prisma.$transaction(async (tx) => {
  //     const otp = await this.otpService.create(user.id, tx);

  //     // Send mail
  //     await this.mailService.sendPasswordResetRequestMail({
  //       options: {
  //         subject: 'Reset your password',
  //         to: user.email,
  //         template: 'password-reset',
  //       },
  //       context: {
  //         otp: otp.value,
  //         uiURL: url,
  //         name: user.firstName,
  //       },
  //     });

  //     return {
  //       message:
  //         'Please follow the instructions sent to your email to reset your password.',
  //     };
  //   });
  // }

  // async requestOtpPublic(otpRequest: PublicOtpRequest) {
  //   const user = await this.usersService.findByUsernameOrEmailOrPhoneNumber(
  //     otpRequest.identity,
  //   );

  //   return this.prisma.$transaction(async (tx) => {
  //     const otp = await this.otpService.create(user.id, tx);

  //     // Send otp via mail
  //     await this.mailService.sendOtpRequestMail({
  //       options: {
  //         subject: otpRequest.reason,
  //         to: user.email,
  //         template: 'otp-request',
  //       },
  //       context: {
  //         otp: otp.value,
  //         name: user.firstName,
  //       },
  //     });

  //     return {
  //       message: 'A one-time-password has been sent your email.',
  //     };
  //   });
  // }

  // async requestOtpAuthenticated(
  //   otpRequest: AuthenticatedOtpRequest,
  //   currentUser: Principal,
  // ) {
  //   return this.prisma.$transaction(async (tx) => {
  //     const otp = await this.otpService.create(currentUser.id, tx);

  //     // Send otp via mail
  //     await this.mailService.sendOtpRequestMail({
  //       options: {
  //         subject: otpRequest.reason,
  //         to: currentUser.email,
  //         template: 'otp-request',
  //       },
  //       context: {
  //         otp: otp.value,
  //         name: currentUser.username,
  //       },
  //     });

  //     return {
  //       message: 'A one-time-password has been sent your email.',
  //     };
  //   });
  // }

  // async passwordReset({ newPassword, otp }: PasswordResetDto) {
  //   return this.prisma.$transaction(async (tx) => {
  //     const oneTimePassword = await this.otpService.verify(otp, tx);

  //     const user = oneTimePassword.user;

  //     await this.usersService.updateUser({
  //       where: {
  //         id: user.id,
  //       },
  //       data: {
  //         passwordDigest: PasswordService.hashedPassword(newPassword),
  //       },
  //     });

  //     return {
  //       message: 'You have successfully reset your password.',
  //     };
  //   });
  // }
}
