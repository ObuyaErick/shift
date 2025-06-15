import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SESSION_KEY } from './auth.types';

@Controller('auth')
export class LoginController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signin')
  async signIn(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sign = await this.authService.signIn(signInDto);

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
      access_token: sign.access_token,
    };
  }

  // @Public()
  // @Post('request-password-reset')
  // async passwordResetRequest(
  //   @Body(
  //     new ValidationPipe({
  //       errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //     }),
  //   )
  //   passwordResetRequestDto: PasswordResetRequestDto,
  // ) {
  //   return await this.authService.passwordResetRequest(passwordResetRequestDto);
  // }

  // @Post('request-otp/public')
  // @Public()
  // async requestOtpPublic(
  //   @Body(
  //     new ValidationPipe({
  //       errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //     }),
  //   )
  //   publicOtpRequest: OtpRequestDto,
  // ) {
  //   return await this.authService.requestOtpPublic(publicOtpRequest);
  // }

  // @Post('request-otp/authenticated')
  // async requestOtpAuthenticated(
  //   @Body(
  //     new ValidationPipe({
  //       errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //     }),
  //   )
  //   authenticatedOtpRequest: AuthenticatedOtpRequest,
  //   @Request() req: ExpressRequest,
  // ) {
  //   return await this.authService.requestOtpAuthenticated(
  //     authenticatedOtpRequest,
  //     req.authentication?.principal!!,
  //   );
  // }

  // @Public()
  // @Post('reset-password')
  // async passwordReset(
  //   @Body(
  //     new ValidationPipe({
  //       errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //     }),
  //   )
  //   passwordResetDto: PasswordResetDto,
  // ) {
  //   return await this.authService.passwordReset(passwordResetDto);
  // }
}
