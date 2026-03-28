import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from './passport/passport.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(ormconfig), PassportModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
