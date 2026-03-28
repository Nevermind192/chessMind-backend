import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../passport.entity';
import { Repository } from 'typeorm';
import type { IUserResponse } from '../interface/IUserResponse.interface';
import type { IResponse } from '../interface/IResponse.interface';
import { Tokens } from 'src/shared/enums/tokens';
import type { IMailSender } from 'src/shared/mailSender/IMailSender.interface';
import { OTP_TYPE, OtpService } from 'src/shared/redis/services/otp.service';
import { ConfirmUserDto } from '../dto/confirmUser.dto';
import { AuthService } from './auth.service';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @Inject(Tokens.MAIL_SENDER)
    private readonly mailSender: IMailSender,

    private readonly _otpService: OtpService,

    private readonly authService: AuthService,
  ) {}

  /**
   * Проверяет, занят ли никнейм.
   * @param nickname - Никнейм для проверки.
   * @returns true, если занят, false, если свободен.
   */
  async isNicknameTaken(nickname: string): Promise<boolean> {
    return await this.userRepository.existsBy({ nickname });
  }

  /**
   * Регистрирует нового пользователя, создает OTP-код и отправляет письмо с подтверждением.
   * * @param createUserDto - Объект с данными нового пользователя (email, nickname, password).
   * @returns Объект ответа IResponse с результатом операции.
   */
  async createUser(createUserDto: CreateUserDto): Promise<IResponse> {
    const existUser = await this.userRepository.existsBy({
      email: createUserDto.email,
    });
    const existUserName = await this.userRepository.existsBy({
      nickname: createUserDto.nickname,
    });
    if (!!existUser) {
      return {
        ok: false,
        errors: { email: { exist: 'Пользователь с таким email уже существует' } },
      };
    }
    if (!!existUserName) {
      return {
        ok: false,
        errors: { nickname: { exist: 'Такое имя пользователя уже занято' } },
      };
    }

    const code = await this._otpService.create(createUserDto.email, OTP_TYPE.CONFIRM);

    const isSended = this.mailSender.sendByTemplate(createUserDto.email, 'activation', {
      username: createUserDto.nickname,
      code: code,
    });

    if (!isSended) {
      return {
        ok: false,
        errors: { email: { invalid: 'Invalid email sending' } },
      };
    }

    let newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    newUser = await this.userRepository.save(newUser);

    return { ok: true, data: void 0 };
  }

  /**
   * Подтверждает регистрацию пользователя по коду из письма.
   * * @param email - Почта пользователя.
   * @param code - Код верификации, полученный из письма.
   * @returns Данные пользователя с JWT-токеном или объект с ошибками.
   */
  async confirmUser(confirmUserDto: ConfirmUserDto): Promise<IResponse<IUserResponse>> {
    if (this._otpService.check(OTP_TYPE.CONFIRM, confirmUserDto.email, confirmUserDto.code)) {
      this._otpService.delete(OTP_TYPE.CONFIRM, confirmUserDto.email);

      const newUser = await this.userRepository.findOneBy({
        email: confirmUserDto.email,
      });
      if (!!newUser) {
        newUser.is_verified = true;
        await this.userRepository.save(newUser);

        const userResponse = this.authService.generateResponseUserWithToken(newUser);
        return { ok: true, data: userResponse };
      } else {
        return {
          ok: false,
          errors: { verificationCode: { exist: 'Такой пользователь не найден' } },
        };
      }
    } else {
      return {
        ok: false,
        errors: { verificationCode: { exist: 'Такой код подтверждения не найден' } },
      };
    }
  }
}
