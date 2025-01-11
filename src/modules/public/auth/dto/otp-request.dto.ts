import { IsNotEmpty } from 'class-validator';

export class OtpRequestDto {
  @IsNotEmpty({ message: 'username is required' })
  username: string;
}
