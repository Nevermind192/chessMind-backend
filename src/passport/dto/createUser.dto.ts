import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, MaxLength, Matches, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'Nickname must be a string' })
  @MinLength(2, { message: 'Nickname must be at least 2 characters long' })
  @MaxLength(30, { message: 'Nickname must be at most 30 characters long' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Nickname can only contain Latin letters, numbers, and URL-safe special characters',
  })
  readonly nickname: string;

  @ApiProperty()
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  readonly email: string;

  @ApiProperty()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(30, { message: 'Password must be at most 30 characters long' })
  readonly password: string;
}
