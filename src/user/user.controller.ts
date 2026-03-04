import { CreateUserDto } from './dto/createUser.dto';
import { UserExistsException } from './exceptions/badRequest.exception';
import { UserService } from './user.service';
import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';

@Controller('api/passport')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('reg')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const result = await this.userService.createUser(createUserDto);

    if (!result.ok) {
      throw new UserExistsException(result);
    }

    return result;
  }
}
