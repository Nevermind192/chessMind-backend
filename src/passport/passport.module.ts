import { Module } from '@nestjs/common';
import { PassportController } from './passport.controller';
import { RegistrationService } from './services/registration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './passport.entity';
import { LoginService } from './services/login.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [PassportController],
  providers: [RegistrationService, LoginService, AuthService],
})
export class PassportModule {}
