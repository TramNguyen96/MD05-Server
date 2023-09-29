import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway(3001,{
    cors: true
})
export class BoxchatGateWay implements OnModuleInit {

    @WebSocketServer()
    server: Server

    onModuleInit() {
        this.server.on('connection', (socket) => {
            // console.log("socketid của user vừa login", socket.id)

            socket.on('disconnect', () => {
                // this.server.emit("loadMessage", `Tam biệt user có socketid là: ${socket.id}`)
            });
        })
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        // console.log("body", body)
        this.server.emit("loadMessage", body)
    }
}