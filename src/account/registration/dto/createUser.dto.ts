import { IsEmail, MinLength, MaxLength, Matches, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Endpoint must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(30, { message: 'Password must be at most 30 characters long' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Nickname can only contain Latin letters, numbers, and URL-safe special characters',
  })
  readonly nickname: string;

  @IsString({ message: 'Endpoint must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  readonly email: string;

  @IsString({ message: 'Endpoint must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(30, { message: 'Password must be at most 30 characters long' })
  readonly password: string;
}
