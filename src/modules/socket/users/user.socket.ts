import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "../../users/entities/user.entity";
import { JwtService } from "../../jwt/jwt";

interface ClientType{
    user: User,
    socket: Socket
}

@WebSocketGateway(3001, {cors:true})
export class UserSocket implements OnModuleInit {
    
    @WebSocketServer()
    server: Server

    clients: ClientType[] = [];

    constructor(private readonly jwt:  JwtService){}

    onModuleInit() {
        this.server.on("connect", async (socket: Socket) => {
            console.log("Đã có người connect");
            
            /* Xóa người dùng ra khỏi danh sách Clients nếu disconnect */
            socket.on("disconnect", () => {
                // console.log(`Client có id: ${socket.id} đã ngắt kết nối!`);
                this.clients = this.clients.filter(client => client.socket.id != socket.id)
            })

            /* Xác thực người dùng */
              let token: string = String(socket.handshake.query.token);
              let user = (this.jwt.verifyToken(token) as User);
              if(token == "undefined" || !user){
                socket.emit("connectStatus", {
                    status : false,
                    message: "Xác thực người dùng thất bại!"
                });
                socket.disconnect();
              }else{
                if(this.clients.find(client => client.user.id == user.id)){
                        socket.emit("connectStatus", {
                        status: false,
                        message:  "Tài khoản đang đăng nhập ở thiết bị khác!"
                    })

                    socket.disconnect();
                    return
                }

                /* Lưu trữ thông tin người dùng vừa kết nối để tương tác */
                this.clients.push({
                    socket,
                    user
                })

                socket.emit("connectStatus", {
                    status: true,
                    message:  "Login thành công!"
                });

                socket.emit("receiveUserData", user);
            }

        })
        
    }

    // async function findReceiptByAuthId(params:type) {
        
    // }


}