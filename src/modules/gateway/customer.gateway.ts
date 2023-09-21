import { OnModuleInit } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { JwtService } from "src/modules/jwt/jwt";
import { DiscordService } from "src/modules/discord/discord.service";

@WebSocketGateway({
    cors: true
})
export class CustomerGateWay implements OnModuleInit{

    constructor(private readonly jwt: JwtService, private readonly discord: DiscordService){}

    @WebSocketServer()
    server: Server

    onModuleInit() {
        this.server.on("connect", (socket) =>{
            // console.log("socket.handshake.query.token", socket.handshake.query.token);
            
            // console.log(`Client co socket id la: ${socket.id} vua ket noi`);
            let userDecode = this.jwt.verifyToken(String(socket.handshake.query.token))

            console.log("userDecode", userDecode);
            
            this.discord.createTextChannel(String(userDecode.firstName +" "+ userDecode.lastName))
             console.log(`Client có socket id là: ${socket.id} vừa kết nối!`)

             socket.emit("connectStatus", `Chào mừng ${String(userDecode.firstName +" "+ userDecode.lastName)} đã kết nối!`)
        })
    }
    
}