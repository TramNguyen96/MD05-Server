import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChannelType, Client, GatewayIntentBits, Guild } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit {
    client: Client<boolean>

    DWtoken: string = "MTE1Mzk4ODU2MDUzNDM3MjM2Mg.GKTTbz.ZQG28sKtOlqs4F_nAKLvmaSqF7H8uq_9J6A3Bc"
    guildId: string ="1153990130038755359"
    guild: Guild | undefined;

    constructor(){}

    onModuleInit(){
        this.client = new Client({ 
        intents: [
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMessages, 
            GatewayIntentBits.MessageContent,
        ],
    });

        this.client.login(this.DWtoken);

        this.client.on("ready",async () => {
            console.log("Da ket noi thanh cong toi Bot - DWStore");
            
            this.createGuild()

            /* Create channel */
            // await this.createTextChannel("Channel 1")
        })
    }

    async createGuild(){
        this.guild = this.client.guilds.cache.get(this.guildId)
    }

    async createTextChannel(channelName: string){
        if(this.guild){
            return await this.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText
        })
        }else {
            console.error("Guild is undefined. Make sure it is created and set.");
        }
        
    }

}