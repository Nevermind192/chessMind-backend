import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { genSalt, hash } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  is_verified: boolean;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await genSalt(10);
      this.password = await hash(this.password, salt);
    }
  }
}
