import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to XYZ',
      getting_started: ['Sign up', 'Select a plan', 'Subscribe to modules'],
    };
  }
}
