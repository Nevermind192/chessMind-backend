import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ConfirmUserDto {
  @IsString({ message: 'Endpoint must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  readonly email: string;

  @IsString({ message: 'Endpoint must be a string' })
  @Length(6, 6, { message: 'Nickname must be at 6 characters long' })
  readonly code: string;
}
