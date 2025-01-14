import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateTeacherDto } from './dto/create-teacher-dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.staffService.createTeacher(createTeacherDto);
  }

  @Get()
  findAll() {
    return this.staffService.findAllTeachers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOneTeacher(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateTeacherDto) {
    return this.staffService.updateTeacher(id, updateStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.removeTeacher(id);
  }
}
