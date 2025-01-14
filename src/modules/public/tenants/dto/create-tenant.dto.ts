import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Length(4)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  logo: string;

  @IsStrongPassword()
  password: string;
}
