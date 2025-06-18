import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SESSION_KEY } from './auth.types';
import { LoginService } from './login.service';

@Controller('auth')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sign = await this.loginService.signIn(signInDto);

    response.cookie(SESSION_KEY, sign.access_token, {
      httpOnly: true,
      // Cookie to be sent over https in production environment
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      // Cookie expires after an hour
      maxAge: 60 * 60 * 1000 * 24,
      // Prevent CSRF
      sameSite: 'lax',
    });

    return {
      message: 'Signed in successfully.',
      accessToken: sign.access_token,
    };
  }
}
