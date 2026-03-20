import { Module } from '@nestjs/common';
import { DevMailSenderService } from './services/devMailSender.services';
import { ProdMailSenderService } from './services/prodMailSender.service';
import { Tokens } from '../enums/tokens';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    DevMailSenderService,
    ProdMailSenderService,
    {
      provide: Tokens.MAIL_SENDER,
      useFactory: (config: ConfigService, devService: DevMailSenderService, prodService: ProdMailSenderService) => {
        return process.env.IS_DEV ? devService : prodService;
      },
      inject: [ConfigService, DevMailSenderService, ProdMailSenderService],
    },
  ],
  exports: [DevMailSenderService, Tokens.MAIL_SENDER],
})
export class mailSenderModule {}
