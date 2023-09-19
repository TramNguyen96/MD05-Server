import { Product } from "src/modules/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string

     @Column("varchar", {
        unique: true,
        length: 50
     })
     title: string

     @Column({
        default: false
    })
    status: boolean;

    @Column({
        default: "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
    })
    avatar: string;

    @OneToMany((type) => Product, (product) => product.category)
    products: Product[]
}
