import { UserEntity } from '../user.entity';

export interface IUserResponse extends Pick<
  UserEntity,
  'id' | 'nickname' | 'email'
> {
  token: string;
}
