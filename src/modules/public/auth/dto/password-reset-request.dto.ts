import { IsNotEmpty } from 'class-validator';

export class PasswordResetRequestDto {
  @IsNotEmpty({ message: 'username is required' })
  username: string;
}
