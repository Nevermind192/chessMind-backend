import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('api/passport')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('reg')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
        return await this.userService.createUser(createUserDto);
    }
}
