import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "src/modules/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReceiptDetail } from "src/modules/receipt-detail/entities/receipt-detail.entity";
import { Receipt } from "src/modules/receipts/entities/receipt.entity";

@Entity()
export class Guest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: true
    })
    name: string;

    @Column({
        nullable: true
    })
    email: string;

    @Column({
        nullable: true
    })
    phoneNumber: string;

   @OneToMany(() => Receipt, (receipts) => receipts.guest)
    receipts: Receipt[];

   
}