
import { User } from "src/modules/users/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

enum ChatType {
    ADMIN = "ADMIN",
    USER = "USER"
}

@Entity()
export class CustomerChat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.customerChat)
    @JoinColumn({name: "userId"})
    user: User

    @Column({ type: "enum", enum: ChatType})
    type: ChatType

    @Column()
    adminId: string;

    @Column()
    timeChat: string;

    @Column()
    contentChat: string;

    @Column()
    channelDiscordId: string;

}