import { Category } from "src/modules/categories/entities/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
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

    @ManyToOne((type) => Category, (category) => category.products)
    // @JoinColumn({ name: "categoryId" })
    category: Category
}
