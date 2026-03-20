import { UserEntity } from '../account.entity';

export interface IUserResponse extends Pick<UserEntity, 'id' | 'nickname' | 'email'> {
  token: string;
}
