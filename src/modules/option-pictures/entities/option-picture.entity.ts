import { ProductOption } from "src/modules/product-options/entities/product-option.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OptionPicture {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    optionId: string;

    @ManyToOne(() => ProductOption, (productOption) => productOption.pictures)
    @JoinColumn({name:'optionId'})
    option: ProductOption;

    @Column()
    icon: string;

    @Column()
    avatar: string;
}
