import { IsNotEmpty } from 'class-validator';

export class PasswordResetRequestDto {
  @IsNotEmpty({ message: 'please identify your school' })
  tenant: string;
  
  @IsNotEmpty({ message: 'username is required' })
  username: string;
}
