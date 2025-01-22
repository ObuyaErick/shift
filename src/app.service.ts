import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello() {
    return {
      message: 'Welcome to XYZ',
      getting_started: ['Sign up', 'Select a plan', 'Subscribe to modules'],
    };
  }
}
