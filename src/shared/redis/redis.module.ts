import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { Tokens } from '../enums/tokens';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';
import { OtpService } from './services/otp.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    OtpService,
    {
      provide: Tokens.REDIS,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<string>('REDIS_PORT');
        const client = createClient({
          url: `redis://${host}:${port}`,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [Tokens.REDIS, OtpService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(
    @Inject(Tokens.REDIS)
    private readonly redisClient: RedisClientType,
  ) {}

  async onApplicationShutdown() {
    await this.redisClient.quit();
  }
}
