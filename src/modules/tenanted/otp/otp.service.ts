import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { random } from 'lodash';
import { OTP } from './otp.entity';
import { DataSource, EntityManager } from 'typeorm';
import { TENANT_DATASOURCE } from 'src/modules/tenancy/tenancy.symbols';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService {
  private readonly otpRepository: Repository<OTP>;
  constructor(
    @Inject(TENANT_DATASOURCE) private readonly tenantDatasource: DataSource,
  ) {
    this.otpRepository = tenantDatasource.getRepository(OTP);
  }

  async create(userId: string, transactionEntityManager?: EntityManager) {
    return this.otpRepository.save({ id: userId, value: this.generateOTP(6) });

    /*return (transactionEntityManager || this.otpRepository).upsert({
      where: { userId },
      update: {
        createdAt: new Date().toISOString(),
      },
      create: {
        value: this.generateOTP(6),
        userId,
      },
    });*/
  }

  async verify(otp: string, transactionEntityManager?: EntityManager) {
    const oneTimePassword = await this.otpRepository
      .findOneByOrFail({
        value: otp,
      })
      .catch(() => {
        throw new NotFoundException('Invalid or expired otp.');
      });
    if (this.isExpired(oneTimePassword)) {
      await this.otpRepository.delete({
        value: otp,
      });
      throw new BadRequestException('Sorry! This OTP expired.');
    }
    return oneTimePassword;
  }

  isExpired(otp: OTP, ms: number = 60 * 1000) {
    const created = new Date(otp.createdAt).getTime();
    const now = Date.now();
    return now > created + ms;
  }

  generateOTP(length: number = 4) {
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    return new Array(length)
      .fill('')
      .map(() => {
        return random(0, 1)
          ? alpha[random(0, alpha.length - 1)]
          : nums[random(0, nums.length - 1)];
      })
      .join('');
  }
}
