import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Response, Request as ExpressRequest } from 'express';
import { ConfigService } from '@nestjs/config';
import { SESSION_KEY } from 'src/lib/keys';

@Controller('auth')
export class AuthController {
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
    };
  }

  @Get('current-user')
  currentUser(@Request() req: ExpressRequest) {
    return {
      principal: req.authentication?.principal,
      authorities: req.authentication?.authorities,
      tenant: req.authentication?.tenant,
    };
  }

  @Post('signout')
  signout(@Res({ passthrough: true }) response: Response) {
    // Clear the 'session' cookie
    response.clearCookie(SESSION_KEY, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    });

    return {
      message: 'Logout successful',
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
