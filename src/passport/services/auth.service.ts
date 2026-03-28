import { Injectable } from '@nestjs/common';
import { UserEntity } from '../passport.entity';
import type { IUserResponse } from '../interface/IUserResponse.interface';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  async comparePasswords(plain: string, hashed: string): Promise<boolean> {
    return await compare(plain, hashed);
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
