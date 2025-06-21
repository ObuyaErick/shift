import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { ConfigService } from '@nestjs/config';
import { Authentication, SESSION_KEY } from './auth.types';
import { APIResponse } from 'src/typings/api.response';

@Controller('session')
export class SessionController {
  constructor(private readonly configService: ConfigService) {}

  @Get('current')
  async currentUser(
    @Request() req: ExpressRequest,
  ): Promise<APIResponse<Partial<Authentication>>> {
    return {
      data: {
        principal: req.authentication?.principal,
        authorities: req.authentication?.authorities,
        tenant: req.authentication?.tenant,
      },
      message: 'Authentication Context',
    };
  }

  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  signout(@Res({ passthrough: true }) response: Response): APIResponse<null> {
    // Clear the 'session' cookie
    response.clearCookie(SESSION_KEY, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
    });

    return {
      data: null,
      message: 'Logout successful',
    };
  }
}
