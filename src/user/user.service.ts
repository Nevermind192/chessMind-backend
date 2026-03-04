import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { IUserResponse } from './interface/IUserResponse.interface';
import { IResponse } from './interface/IResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<IResponse<IUserResponse>> {
    const existUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (!!existUser) {
      return {
        ok: false,
        errors: { emailExist: 'Пользователь с таким email уже существует' },
      };
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);

    const userResponse = this.generateResponseUser(
      await this.userRepository.save(newUser),
    );
    return { ok: true, data: userResponse };
  }

  generateResponseUser({ id, nickname, email }: UserEntity): IUserResponse {
    return { id, nickname, email, token: '' };
  }
}
