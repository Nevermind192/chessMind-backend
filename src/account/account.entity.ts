import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { genSalt, hash } from "bcrypt"

@Entity({name: "users"})
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    nickname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if(this.password) {
            const salt = await genSalt(10);
            this.password = await hash(this.password, salt);
        }
    }
}