import { Injectable } from '@nestjs/common';
import { LoginByNicknameDto } from '../dto/loginByNickname.dto';
import { UserEntity } from '../passport.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import type { IResponse } from '../interface/IResponse.interface';
import type { IUserResponse } from '../interface/IUserResponse.interface';
import { LoginByEmailDto } from '../dto/loginByEmail.dto';
import { compare } from 'bcrypt';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async loginByNickname(loginByNicknameDto: LoginByNicknameDto): Promise<IResponse<IUserResponse>> {
    const existNickname = await this.userRepository.findOneBy({
      nickname: loginByNicknameDto.nickname,
    });
    const checkPassword = await this.authService.comparePasswords(loginByNicknameDto.password, existNickname.password);

    if (!existNickname || !existNickname.is_verified || !checkPassword) {
      return {
        ok: false,
        errors: { email: { exist: 'Неверно введен логин или пароль' } },
      };
    }
    const loginResponse = this.authService.generateResponseUserWithToken(existNickname);
    return { ok: true, data: loginResponse };
  }

  async loginByEmail(loginByEmailDto: LoginByEmailDto): Promise<IResponse<IUserResponse>> {
    const existEmail = await this.userRepository.findOneBy({
      email: loginByEmailDto.email,
    });
    const checkPassword = await compare(loginByEmailDto.password, existEmail.password);
    if (!existEmail || !existEmail.is_verified || !checkPassword) {
      return {
        ok: false,
        errors: { email: { exist: 'Неверно введен логин или пароль' } },
      };
    }
    const loginResponse = this.authService.generateResponseUserWithToken(existEmail);
    return { ok: true, data: loginResponse };
  }
}
