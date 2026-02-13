import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  role?: string;
}
