import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { AuthSupportService } from './auth-support.service';
import { APIResponse } from 'src/typings/api.response';

@Controller('auth/support')
export class AuthSupportController {
  constructor(private readonly authSupportService: AuthSupportService) {}

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(
    @Body()
    passwordResetRequestDto: PasswordResetRequestDto,
  ): Promise<APIResponse<null>> {
    return await this.authSupportService.requestPasswordReset(
      passwordResetRequestDto,
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async passwordReset(
    @Body()
    passwordResetDto: PasswordResetDto,
  ): Promise<APIResponse<null>> {
    return await this.authSupportService.passwordReset(passwordResetDto);
  }
}
