import { Inject, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import type { RedisClientType } from 'redis';
import { Tokens } from 'src/shared/enums/tokens';

export const enum OTP_TYPE {
  CONFIRM = 'authOtp',
  RESET = 'resetOtp',
}

@Injectable()
export class OtpService {
  constructor(
    @Inject(Tokens.REDIS)
    private readonly redis: RedisClientType,
  ) {}

  async create(email: string, type: OTP_TYPE): Promise<string> {
    const code = randomInt(100000, 999999).toString();
    const key = `${type}:${email}`;

    await this.redis.set(key, code, { EX: 300 });
    return code;
  }

  async check(type: OTP_TYPE, email: string, code: string): Promise<boolean> {
    const savedCode = await this.redis.get(`${type}:${email}`);
    if (savedCode && savedCode === code) {
      return true;
    } else {
      return false;
    }
  }

  async delete(type: OTP_TYPE, email: string) {
    await this.redis.del(`${type}:${email}`);
  }
}
