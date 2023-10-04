import { Category } from "src/modules/categories/entities/category.entity";
import { ProductOption } from "src/modules/product-options/entities/product-option.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    name: string;

    @Column({ default: '' })
    des: string;

    @Column({ default: false })
    status: boolean

    @Column({
        nullable: false
    })
    categoryId: string;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category

    // @Column('float')
    // price: number;

    @Column({default: false})
    bestSeller: boolean;

    @OneToMany(() => ProductOption, (option) => option.product)
    options: ProductOption[];

}
