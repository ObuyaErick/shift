import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionController } from './session.controller';
import { LoginController } from './login.controller';
import { UsersService } from '../users/users.service';
import { OtpService } from '../otp/otp.service';
import { AuthSupportController } from './auth-support.controller';
import { LoginService } from './login.service';
import { AuthSupportService } from './auth-support.service';

@Module({
  controllers: [LoginController, SessionController, AuthSupportController],
  providers: [
    AuthService,
    UsersService,
    OtpService,
    LoginService,
    AuthSupportService,
  ],
})
export class AuthModule {}
