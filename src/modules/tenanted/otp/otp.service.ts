import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { random } from 'lodash';
import { OTP } from './otp.entity';
import { EntityManager } from 'typeorm';

// Milliseconds
export const OTP_EXPIRY_WINDOW = 5 * 60 * 1000;

@Injectable()
export class OtpService {
  constructor() {}

  async create(userId: string, entityManager: EntityManager) {
    await entityManager.upsert(
      OTP,
      {
        user: { id: userId },
        value: this.generateOTP(6),
        createdAt: new Date(),
      },
      ['user'],
    );
    return entityManager.findOneOrFail(OTP, {
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async verify(otp: string, entityManager: EntityManager) {
    const otpRepository = entityManager.getRepository(OTP);
    const oneTimePassword = await otpRepository
      .findOneOrFail({
        where: { value: otp },
        relations: ['user'],
      })
      .catch(() => {
        throw new NotFoundException('Invalid or expired otp.');
      });
    if (this.isExpired(oneTimePassword)) {
      throw new BadRequestException('Sorry! This OTP expired.');
    }
    return oneTimePassword;
  }

  isExpired(
    otp: OTP,
    ms: number = OTP_EXPIRY_WINDOW, // 5 minutes
  ) {
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
