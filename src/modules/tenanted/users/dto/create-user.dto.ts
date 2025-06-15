import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsEmail({}, { message: 'invalid email' })
  email?: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
