import {
  IsNotEmpty,
  IsStrongPassword,
  Length,
  ValidateIf,
} from 'class-validator';
import { IsMatching } from 'src/validators/ismatching.validator';

export class PasswordResetDto {
  @IsNotEmpty({ message: 'please identify your school' })
  tenant: string;
  
  @IsStrongPassword({ minLength: 8 }, { message: 'weak password' })
  newPassword: string;

  @ValidateIf((o, _v) => !!o.newPassword && !!o.confirmNewPassword)
  @IsMatching('newPassword', { message: 'passwords do not match' })
  confirmNewPassword: string;

  @Length(6, 6, { message: 'otp must be 6 characters' })
  otp: string;
}
