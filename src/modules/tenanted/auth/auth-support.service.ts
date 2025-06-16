import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { PasswordResetDto } from './dto/password-reset.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { TenantsService } from 'src/modules/public/tenants/tenants.service';
import { getTenantDatasource } from 'src/modules/tenancy/tenancy.datasource';
import { User } from '../users/entities/user.entity';
import { PasswordService } from 'src/passwords/password.service';
import { OtpService } from '../otp/otp.service';
import { OTP } from '../otp/otp.entity';

@Injectable()
export class AuthSupportService {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly tenantsService: TenantsService,
    private readonly otpService: OtpService,
  ) {}

  async requestPasswordReset({ username, tenant }: PasswordResetRequestDto) {
    // Attempt to find tenant by username
    const _tenant = await this.tenantsService.find({
      username: tenant,
    });

    // Find user
    const tenantDataSource = await getTenantDatasource(_tenant.id);
    const user = await tenantDataSource.getRepository(User).findOneOrFail({
      where: [{ username: username }, { email: username }],
    });

    if (!user.email) {
      throw new BadRequestException('No email associated with this account.');
    }

    const host = this.configService.getOrThrow<string>('FRONTEND_HOST');
    const path = '/reset-password';
    const url = new URL(path, host).toString();

    return tenantDataSource.transaction(async (entityManager) => {
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

  async passwordReset({ newPassword, otp, tenant }: PasswordResetDto) {
    // Attempt to find tenant by username
    const _tenant = await this.tenantsService.find({
      username: tenant,
    });

    // Find user
    const tenantDataSource = await getTenantDatasource(_tenant.id);
    return tenantDataSource
      .transaction(async (entityManager) => {
        const oneTimePassword = await this.otpService
          .verify(otp, entityManager)
          .finally(() => {});
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
      })
      .finally(async () => {
        await tenantDataSource.getRepository(OTP).delete({
          value: otp,
        });
      });
  }
}
