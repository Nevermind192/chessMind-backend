import { CreateUserDto } from './registration/dto/createUser.dto';
import { UserExistsException } from './exceptions/badRequest.exception';
import { AuthGuard } from './guards/auth.guard';
import { RegistrationService } from './registration/registration.service';
import { Controller, Get, Post, Body, BadRequestException, UseGuards, Query } from '@nestjs/common';
import type { ConfirmUserDto } from './registration/dto/confirmUser.dto';

/**
 * Контроллер для работы с аккаунтом пользователя.
 */
@Controller('api/passport')
export class AccountController {
  constructor(private readonly userService: RegistrationService) {}

  /**
   * Создает нового пользователя в системе.
   * @param createUserDto Объект с данными пользователя для регистрации.
   * @returns Результат создания пользователя или ошибка, если пользователь уже существует.
   */
  @Post('reg')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const result = await this.userService.createUser(createUserDto);

    if (!result.ok) {
      throw new UserExistsException(result);
    }

    return result;
  }

  @Post('confirm')
  async confirmUser(@Body() confirmUser: ConfirmUserDto): Promise<any> {
    const result = await this.userService.confirmUser(confirmUser);

    if (!result.ok) {
      throw new UserExistsException(result);
    }

    return result;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe() {
    return { hello: 'world' };
  }
}
