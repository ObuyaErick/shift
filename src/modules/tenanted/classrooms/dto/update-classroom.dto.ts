import { PartialType } from '@nestjs/mapped-types';
import { CreateClassroomDto } from './create-classroom.dto';
import { IsUUID } from 'class-validator';

export class UpdateClassroomDto extends PartialType(CreateClassroomDto) {}

export class AssignClassTeacherDto {
  @IsUUID(4, { message: 'invalid classroom id format' })
  classroomId: string;
  @IsUUID(4, { message: 'invalid teacher id format' })
  classTeacherId: string;
}
