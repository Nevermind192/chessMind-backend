import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { RegistrationService } from './registration/registration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AccountController],
  providers: [RegistrationService],
})
export class AccountModule {}
