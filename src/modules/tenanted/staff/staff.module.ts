import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TeachersController } from './teachers.controller';

@Module({
  controllers: [StaffController, TeachersController],
  providers: [StaffService],
})
export class StaffModule {}
