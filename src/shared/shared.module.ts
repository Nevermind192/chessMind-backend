import { Global, Module } from '@nestjs/common';
import { mailSenderModule } from './mailSender/mailSender.module';
import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [mailSenderModule, RedisModule],
  exports: [mailSenderModule, RedisModule],
})
export class SharedModule {}
