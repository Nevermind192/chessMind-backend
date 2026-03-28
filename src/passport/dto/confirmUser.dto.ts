import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ConfirmUserDto {
  @ApiProperty()
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  readonly email: string;

  @ApiProperty()
  @IsString({ message: 'Code must be a string' })
  @Length(6, 6, { message: 'OTP-code must be at 6 characters long' })
  readonly code: string;
}
