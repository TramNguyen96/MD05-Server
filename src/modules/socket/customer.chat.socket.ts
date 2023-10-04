import { Inject, OnModuleInit, forwardRef } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { DiscordBotSocket } from "./discord.bot.socket";
import { User } from "../users/entities/user.entity";
import { CustomerChatService } from "./customers/customer.chat.service";
import { JwtService } from "../jwt/jwt";


@WebSocketGateway({cors: true})
export class CustomerChatSocket implements OnModuleInit {

    /* Lớp decor này dùng để mở socket server */
    @WebSocketServer()
    server: Server

      /*Lưu tất cả client đang kết nối với server */
      clients: {
        user: User,
        socket: Socket,
        discordChannelId: string
      }[] = [];

    constructor(
        @Inject(forwardRef(() => DiscordBotSocket))
        private readonly discordBotSocket :DiscordBotSocket,
        private readonly customerChatService:  CustomerChatService,
        private readonly jwt:  JwtService

    ){}

    onModuleInit() {
       console.log("Customer Chat Socket Gateway đã mở!");

        /* Lắng nghe cổng connect đón những client kết nối tới */
       this.server.on("connect",async (socket: Socket) => {
            console.log("client connect id là:", socket.id);
            
            socket.on("disconnect", () => {
                // console.log(`Client có id: ${socket.id} đã ngắt kết nối!`);
                this.clients = this.clients.filter(client => client.socket.id != socket.id)
            })

              /* Xác thực người dùng */
              let token: string = String(socket.handshake.query.token);
              let user = (this.jwt.verifyToken(token) as User);
              if(token == "undefined" || !user){
                socket.emit("connectStatus", "Xác thực người dùng thất bại!");
                socket.disconnect();
              }else{
                socket.emit("connectStatus", `Kết nối chat thành công id phiên làm việc là: ${socket.id}`)
                /* Khi vượt qua bước xác thực, tiến hành lưu trữ thông tin về người dùng đang kết nối vào thuộc tính clients */
                /* Step 1: tìm xem người dùng đã từng truy cập dịch vụ chat hay chưa */
                let listChatHistory = await this.customerChatService.findChatByUserId(user.id)
                let newClient = {
                  discordChannelId: "",
                  socket,
                  user
                }
                // console.log("newClient", newClient);
                
                if(!listChatHistory){
                   /* Đăng ký 1 discord text channel cho người dùng này */
                   let channel = await this.discordBotSocket.createTextChannel(`${user.firstName} ${user.lastName}`);
                    /* lưu trữ lại channel id */
                    newClient.discordChannelId = channel.id;
                    /* gửi một lời chào tới người dùng */
                    let chat = {
                      content: `Hi ${user.firstName} ${user.lastName}, How can we help you?`,
                      discordChannelId: newClient.discordChannelId,
                      time: String(Date.now()),
                      userId: user.id,
                      adminId: process.env.CHATBOX_ADMINID
                    }

                    let newChatHistory = await this.customerChatService.createChat(chat);
                    if(newChatHistory){
                      /* Nếu thành công thì tiến hành gửi nó qua cổng historyMessage cho client và ghi chép vào discord */
                      newClient.socket.emit("historyMessage", newChatHistory)
                      let channel = await this.discordBotSocket.getTextChannel(newClient.discordChannelId)
                      channel.send(`**ADMIN: ${chat.content}**`)
                    }
                }else{
                      /* Đã từng */
                      /* ghi lại channel của người dùng */
                      newClient.discordChannelId = listChatHistory[0].discordChannelId;
                      /* trả lại toàn bộ lịch sử chat cho người dùng qua cổng historyMessage */
                      socket.emit("historyMessage", listChatHistory)
                }
                 /* Lưu trữ thông tin người dùng vừa kết nối để tương tác về sau */
                    this.clients.unshift(newClient)
                    // console.log("this.clients", this.clients);

              }
             
       })
       
    }

    async sendMessageToClient(channelId: string, content: string){
      let client =  this.clients.find(client => client.discordChannelId == channelId)
      
      if(client){
        
        let chat = {
          content,
          discordChannelId: client.discordChannelId,
          time: String(Date.now()),
          userId: client.user.id,
          adminId: process.env.CHATBOX_ADMINID
        }

        let listChatHistory = await this.customerChatService.createChat(chat);
        
        if(listChatHistory){
          client.socket.emit("historyMessage", listChatHistory)
        }else{
          let channel = await this.discordBotSocket.getTextChannel(channelId);
          //channel.send(`${content}`)
          channel.send(`**BOT: Sending message failed**`)
        }
      }else{
        /* Không có ai đang chơi với bot ở đây */
        let channel = await this.discordBotSocket.getTextChannel(channelId)
        const cssCode = "```diff\nBOT: User is offline!\n```";
        channel.send(`${cssCode}`)
      }
    }

     /* Lắng nghe cổng createMessage chờ người dùng nhắn tin tới */
     @SubscribeMessage("createMessage")
     async createMessage(@MessageBody() body: {
      socketId: string,
      content: string
     }){
      let client = this.clients.find(client => client.socket.id == body.socketId);
      // console.log("client", client);
      
      if(client){
        let chat = {
          content: body.content,
          discordChannelId: client.discordChannelId,
          time: String(Date.now()),
          userId: client.user.id,
          adminId: null
        }

        let listChatHistory = await this.customerChatService.createChat(chat);
        console.log("listChatHistory", listChatHistory);

        if(listChatHistory){
          let channel = await this.discordBotSocket.getTextChannel(client.discordChannelId)
          // console.log("channel", channel);
          channel.send(`**${client.user.firstName} ${client.user.lastName}: ${body.content}**`)
          client.socket.emit("historyMessage", listChatHistory)
        }
      }

     }


}