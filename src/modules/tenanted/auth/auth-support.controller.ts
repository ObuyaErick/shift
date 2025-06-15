import {
  Body,
  Controller,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

@Controller('auth')
export class AuthSupportController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    passwordResetRequestDto: PasswordResetRequestDto,
  ) {
    return await this.authService.requestPasswordReset(passwordResetRequestDto);
  }

  @Post('reset-password')
  async passwordReset(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    passwordResetDto: PasswordResetDto,
  ) {
    return await this.authService.passwordReset(passwordResetDto);
  }
}
