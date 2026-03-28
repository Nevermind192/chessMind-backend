import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginByEmailDto {
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
