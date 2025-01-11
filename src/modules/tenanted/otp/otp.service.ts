import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OneTimePassword, Prisma } from '@prisma/client';
import { getRandomInt } from 'src/lib/utils';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, transactionClient?: Prisma.TransactionClient) {
    return (transactionClient || this.prisma).oneTimePassword.upsert({
      where: { userId },
      update: {
        createdAt: new Date().toISOString(),
      },
      create: {
        value: this.generateOTP(6),
        userId,
      },
    });
  }

  async verify(otp: string, transactionClient?: Prisma.TransactionClient) {
    const oneTimePassword = await (
      transactionClient || this.prisma
    ).oneTimePassword
      .findFirstOrThrow({
        where: {
          value: otp,
        },
        include: {
          user: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Invalid or expired otp.');
      });
    if (this.isExpired(oneTimePassword)) {
      await (transactionClient || this.prisma).oneTimePassword.delete({
        where: {
          value: otp,
        },
      });
      throw new BadRequestException('Sorry! This OTP is expired.');
    }
    return oneTimePassword;
  }

  isExpired(otp: OneTimePassword, ms: number = 60 * 1000) {
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
        return getRandomInt(0, 1)
          ? alpha[getRandomInt(0, alpha.length - 1)]
          : nums[getRandomInt(0, nums.length - 1)];
      })
      .join('');
  }
}
