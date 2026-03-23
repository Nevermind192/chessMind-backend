import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../account.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from '../interface/IUserResponse.interface';
import { IResponse } from '../interface/IResponse.interface';
import { sign } from 'jsonwebtoken';
import { Tokens } from 'src/shared/enums/tokens';
import type { IMailSender } from 'src/shared/mailSender/IMailSender.interface';
import { OTP_TYPE, OtpService } from 'src/shared/redis/services/otp.service';
import { ConfirmUserDto } from './dto/confirmUser.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @Inject(Tokens.MAIL_SENDER)
    private readonly mailSender: IMailSender,

    private readonly _otpService: OtpService,
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
    const existUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    const existUserName = await this.userRepository.findOneBy({
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
        const userResponse = this.generateResponseUserWithToken(newUser);
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

  /**
   * Формирует объект ответа пользователя и подписывает JWT токен.
   * * @param user - Сущность пользователя из БД.
   * @returns Объект пользователя с публичными полями и токеном доступа.
   * @private
   */
  generateResponseUserWithToken({ id, nickname, email }: UserEntity): IUserResponse {
    return { id, nickname, email, token: sign({ id }, process.env.JWT_SECRET_KEY) };
  }
}
