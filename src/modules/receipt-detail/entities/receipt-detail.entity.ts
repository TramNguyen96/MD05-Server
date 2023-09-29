import { ProductOption } from "src/modules/product-options/entities/product-option.entity";
import { Receipt } from "src/modules/receipts/entities/receipt.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReceiptDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    receiptId: string;

    @ManyToOne(() => Receipt, (receipt) => receipt.detail)
    @JoinColumn({ name: 'receiptId' })
    receipt: Receipt;

    @Column()
    optionId: string;

    @ManyToOne(() => ProductOption, (option) => option.sold)
    @JoinColumn({ name: 'optionId' })
    option: ProductOption

    @Column()
    quantity: number
}