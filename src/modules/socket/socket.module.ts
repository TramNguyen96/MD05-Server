import { Module } from "@nestjs/common";
import { DiscordBotSocket } from "./discord.bot.socket";
import { CustomerChatSocket } from "./customer.chat.socket";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerChats } from "./customers/entities/customer.chat.entity";
import { JwtService } from "../jwt/jwt";
import { CustomerChatService } from "./customers/customer.chat.service";
import { UserSocket } from "./users/user.socket";
import { Receipt } from "../receipts/entities/receipt.entity";
import { ReceiptDetail } from "../receipt-detail/entities/receipt-detail.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([CustomerChats, Receipt, ReceiptDetail])
    ],
    providers: [DiscordBotSocket, CustomerChatSocket, CustomerChatService, JwtService, UserSocket]
})
export class SocketModule {}