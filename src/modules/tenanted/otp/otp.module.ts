import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [OtpService, PrismaService],
  exports: [OtpService],
})
export class OtpModule {}
