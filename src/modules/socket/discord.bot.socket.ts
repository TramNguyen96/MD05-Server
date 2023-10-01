import { Inject, Injectable, OnModuleInit, forwardRef } from "@nestjs/common";
import { ChannelType, Client, GatewayIntentBits, Guild, Message, TextChannel } from "discord.js";
import { CustomerChatSocket } from "./customer.chat.socket";

@Injectable()
export class DiscordBotSocket implements OnModuleInit {

    client: Client;

    botToken: string = "MTE1Mzk4ODU2MDUzNDM3MjM2Mg.GONRaf.rs8bqnhgninLUE7yw1u-V9k1q2hOyl33vuwxeA"

    guildId: string = "1153990130038755359"

    guild: Guild
 
    constructor(
        @Inject(forwardRef(()  => CustomerChatSocket))
        private readonly customerChatSocket : CustomerChatSocket
    ){}
 
    onModuleInit(): void {
         /* Khởi tạo instance client discord */
         this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
         }); 

          /* Yêu cầu client đăng nhập vào bot */
          
          this.client.login(this.botToken)

           /* Lắng nghe sự kiện ready từ server discord, nếu bot đã sẵn sàng sử dụng thì chạy callback function*/
           this.client.on("ready", () => {
                console.log("Discord Bot Socket Đã Mở!");

                /* Khi Bot đã sẵn sàng thì chạy các lệnh sau */
                this.connectGuild();

                this.client.on("messageCreate", (message: Message) => {
                    // console.log("message", message.content);
                    if(!message.author.bot){
                        // message.reply("Please wait a second!")
                        this.customerChatSocket.sendMessageToClient(message.channelId, message.content)
                    }
                    
                })
           })
    }
 
    connectGuild(): void{
        /* Lấy instance của kênh discord mình muốn làm việc theo ID Kênh và gán nó cho thuộc tính guild  */
        this.guild = this.client.guilds.cache.get(this.guildId)
    }

    async createTextChannel(channelName: string): Promise<TextChannel> {
        return this.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText
        })
    }

    async getTextChannel(channelId: string): Promise<TextChannel> {
        return (this.guild.channels.cache.get(channelId) as TextChannel)
    }

}