import { CreateUserDto } from './dto/createUser.dto';
import { UserExistsException } from './exceptions/badRequest.exception';
import { AuthGuard } from './guards/auth.guard';
import { RegistrationService } from './services/registration.service';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ConfirmUserDto } from './dto/confirmUser.dto';
import { LoginByNicknameDto } from './dto/loginByNickname.dto';
import { LoginService } from './services/login.service';
import { LoginByEmailDto } from './dto/loginByEmail.dto';

/**
 * Контроллер для работы с аккаунтом пользователя.
 */
@Controller('api/passport')
export class PassportController {
  constructor(private readonly registrationService: RegistrationService, private readonly loginService: LoginService) {}

  /**
   * Создает нового пользователя в системе.
   * @param createUserDto Объект с данными пользователя для регистрации.
   * @returns Результат создания пользователя или ошибка, если пользователь уже существует.
   */
  @Post('reg')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const result = await this.registrationService.createUser(createUserDto);

    if (!result.ok) {
      throw new UserExistsException(result);
    }

    return result;
  }

  @Post('confirm')
  async confirmUser(@Body() confirmUser: ConfirmUserDto): Promise<any> {
    const result = await this.registrationService.confirmUser(confirmUser);

    return result;
  }

  @Post('loginByNickname')
  async loginByNickname(@Body() loginByNicknameDto: LoginByNicknameDto): Promise<any> {
    const result = await this.loginService.loginByNickname(loginByNicknameDto);

    return result;
  }

  @Post('loginByEmail')
  async loginByEmail(@Body() loginByEmailDto: LoginByEmailDto): Promise<any> {
    const result = await this.loginService.loginByEmail(loginByEmailDto);

    return result;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe() {
    return { hello: 'world' };
  }
}
