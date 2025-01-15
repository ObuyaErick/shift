import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateClassroomDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  slug: string;

  @IsUUID(4)
  @IsOptional()
  classTeacherId: string;
}
