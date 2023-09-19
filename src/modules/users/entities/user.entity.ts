import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as  bcrypt from 'bcrypt'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    userName: string;
    
    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}