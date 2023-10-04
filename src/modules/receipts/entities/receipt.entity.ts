import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "src/modules/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReceiptDetail } from "src/modules/receipt-detail/entities/receipt-detail.entity";
import { PayMode, ReceiptStatus } from "../receipts.enum";
import { Guest } from "src/modules/guest/entities/guest.entity";

@Entity()
export class Receipt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: true
    })
    userId: string;

    @Column({
        nullable: true
    })
    guestId: string;

    @ManyToOne(() => User, (user) => user.receipts)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Guest, (guest) => guest.receipts)
    @JoinColumn({ name: 'guestId' })
    guest: User;

     @Column({
        default:0
     })
    total: number;

    @Column({
        type: "enum",
        enum: ReceiptStatus,
        default: ReceiptStatus.SHOPPING
    })
    status: ReceiptStatus

    @Column({
        default: false
    })
    paid: boolean

    @Column({
        type: "enum",
        enum: PayMode,
        default: PayMode.CASH
    })
    payMode: PayMode

    @Column({
        nullable: true
    })
    paidAt: string

    @Column({
        nullable: true
    })
    zaloTranId: string

    @Column()
    creatAt: string;

    @Column({
        nullable: true
    })
    accepted: string;

    @Column({
        nullable: true
    })
    shippAt: string;

    @Column({
        nullable: true
    })
    doneAt: string;

    @BeforeInsert()
    setCreateTime() {
        this.creatAt = String(Date.now())
    }

    @OneToMany(() => ReceiptDetail, (receiptDetail) => receiptDetail.receipt)
    detail: ReceiptDetail[];

    @OneToMany(() => ReceiptDetail, (receiptDetail) => receiptDetail.option)
    sold: ReceiptDetail[];
}