import { UserEntity } from '../passport.entity';

export interface IUserResponse extends Pick<UserEntity, 'id' | 'nickname' | 'email'> {
  token: string;
}
