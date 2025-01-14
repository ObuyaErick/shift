import { Injectable } from '@nestjs/common';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { CreateTeacherDto } from './dto/create-teacher-dto';

@Injectable()
export class StaffService {
  createTeacher(createTeacherDto: CreateTeacherDto) {
    return 'This action adds a new staff';
  }

  findAllTeachers() {
    return `This action returns all staff`;
  }

  findOneTeacher(id: string) {
    return `This action returns a #${id} staff`;
  }

  updateTeacher(id: string, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  removeTeacher(id: string) {
    return `This action removes a #${id} staff`;
  }
}
