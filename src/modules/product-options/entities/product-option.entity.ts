import { OptionPicture } from "src/modules/option-pictures/entities/option-picture.entity";
import { Product } from "src/modules/products/entities/product.entity";
import { ReceiptDetail } from "src/modules/receipt-detail/entities/receipt-detail.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductOption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productId: string;

    @ManyToOne(() => Product, (Product) => Product.options)
    @JoinColumn({name: 'productId'})
    product: Product;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

     @Column({
        default: false
    })
    status: boolean;

    @Column()
    title: string;

    @OneToMany(() => OptionPicture, (optionPicture) => optionPicture.option)
    pictures: OptionPicture[];

    @OneToMany(() => ReceiptDetail, (detail) => detail.option)
    sold: ReceiptDetail[];
}
