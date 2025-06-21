import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SESSION_KEY } from './auth.types';
import { LoginService } from './login.service';
import { APIResponse } from 'src/typings/api.response';

@Controller('auth')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body()
    signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<APIResponse<{ accessToken: string }>> {
    const sign = await this.loginService.signIn(signInDto);

    response.cookie(SESSION_KEY, sign.data.accessToken, {
      httpOnly: true,
      // Cookie to be sent over https in production environment
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      // Cookie expires after an hour
      maxAge: 60 * 60 * 1000 * 24,
      // Prevent CSRF
      sameSite: 'lax',
    });

    return sign;
  }
}
