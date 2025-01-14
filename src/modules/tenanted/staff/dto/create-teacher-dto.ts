import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export enum EmploymentType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Contract = 'Contract',
}

export class CreateTeacherDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  qualification: string;

  @IsEnum(EmploymentType)
  employmentType: string; // 'Full-time', 'Part-time', 'Contract'
}
