import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server} from 'socket.io'
@WebSocketGateway({
    cors: true
})
export class MyGateway implements OnModuleInit{

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log("socketid", socket.id)
            console.log("connected")
            socket.on('disconnect', () => {
                this.server.emit("log", `Bye Bye ${socket.id}`)
                console.log(`User disconnected: ${socket.id}`);
            });
        })
    }
    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log("body", body)
        this.server.emit('onMessage', body)
    }
}