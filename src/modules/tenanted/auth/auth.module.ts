import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionController } from './session.controller';
import { LoginController } from './login.controller';

@Module({
  controllers: [LoginController, SessionController],
  providers: [AuthService],
})
export class AuthModule {}
