import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as  bcrypt from 'bcrypt'
import { UserRole, UserStatus } from "../users.enum";
import { CustomerChats } from "src/modules/socket/customers/entities/customer.chat.entity";
import { Receipt } from "src/modules/receipts/entities/receipt.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    userName: string;

    @Column()
    email: string;
    
    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @Column({ default: false })
    emailConfirm: boolean;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({default: "https://icon-library.com/images/avatar-icon-png/avatar-icon-png-15.jpg"})
    avatar: string;

     @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
    role: UserRole;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({
        default: String(Date.now())
    })
    createAt: String;

    @Column({
        default: String(Date.now())
    })
    updateAt: String;

    @BeforeUpdate()
    async setUpdateTime() {
        this.updateAt = String(Date.now());
    }

    @OneToMany(() => CustomerChats, (customerChats) => customerChats.user)
    customerChat: CustomerChats[];

   @OneToMany(() => CustomerChats, (customerChats) => customerChats.admin)
    adminChats: CustomerChats[];

    @OneToMany(() => Receipt, (receipts) => receipts.user)
    receipts: Receipt[];
}