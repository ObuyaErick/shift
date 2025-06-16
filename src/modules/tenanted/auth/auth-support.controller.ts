import {
  Body,
  Controller,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { AuthSupportService } from './auth-support.service';

@Controller('auth/support')
export class AuthSupportController {
  constructor(private readonly authSupportService: AuthSupportService) {}

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    passwordResetRequestDto: PasswordResetRequestDto,
  ) {
    return await this.authSupportService.requestPasswordReset(
      passwordResetRequestDto,
    );
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
    return await this.authSupportService.passwordReset(passwordResetDto);
  }
}
