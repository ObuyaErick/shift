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
import { SESSION_KEY } from './auth.types';

@Controller('session')
export class SessionController {
  constructor(private readonly configService: ConfigService) {}

  @Get('current-user')
  currentUser(@Request() req: ExpressRequest) {
    console.log('GET: ', 'session/current-user');
    return {
      principal: req.authentication?.principal,
      authorities: req.authentication?.authorities,
      tenant: req.authentication?.tenant,
    };
  }

  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
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
}
