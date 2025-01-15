import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { StaffService } from '../staff/staff.service';

@Module({
  controllers: [ClassroomsController],
  providers: [ClassroomsService, StaffService],
})
export class ClassroomsModule {}
