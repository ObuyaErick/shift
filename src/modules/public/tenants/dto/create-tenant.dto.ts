import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  Min,
} from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Min(4)
  username: string;

  @IsNotEmpty()
  @IsEmail(undefined, { message: 'valid email is required' })
  email: string;

  @IsNotEmpty({ message: 'an address is required' })
  address: string;

  @IsNotEmpty()
  @IsOptional()
  logo: string;

  @IsStrongPassword()
  password: string;
}
