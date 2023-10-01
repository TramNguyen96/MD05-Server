import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "../../users/entities/user.entity";
import { JwtService } from "../../jwt/jwt";
import { ReceiptsService } from "src/modules/receipts/receipts.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Receipt } from "src/modules/receipts/entities/receipt.entity";
import { Repository } from "typeorm";
import { ReceiptStatus } from "src/modules/receipts/receipts.enum";
import { ReceiptDetail } from "src/modules/receipt-detail/entities/receipt-detail.entity";

interface ClientType{
    user: User,
    socket: Socket
}

@WebSocketGateway(3001, {cors:true})
export class UserSocket implements OnModuleInit {
    
    @WebSocketServer()
    server: Server

    clients: ClientType[] = [];

    constructor(
        private readonly jwt:  JwtService,
         @InjectRepository(Receipt) private readonly receipts: Repository<Receipt>,
         @InjectRepository(ReceiptDetail) private readonly receiptDetail: Repository<ReceiptDetail>,
    ){}

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
                // if(this.clients.find(client => client.user.id == user.id)){
                //         socket.emit("connectStatus", {
                //         status: false,
                //         message:  "Tài khoản đang đăng nhập ở thiết bị khác!"
                //     })

                //     socket.disconnect();
                //     return
                // }

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

                /* Receipt */
                let receipt = await this.findReceiptByAuthId({
                    userId: user.id,
                    guestId: null
                })

                socket.emit("receiveReceipt", receipt ? receipt : [] )

                /* Cart */
                let cart = await this.getCartByUserId(user.id)
                
                if(cart){
                    socket.emit("receiveCart", cart)
                }

                /* Listen Cart from Client */
                socket.on("addToCart", async (newItem: {receiptId: string, optionId: string, quantity: number}) => {
                    let cart = await this.addToCart(newItem)
                    if(cart){
                        for(let i in this.clients){
                            if(this.clients[i].user.id == user.id){
                                this.clients[i].socket.emit("receiveCart", cart)
                            }
                        }
                    }
                })

                // socket.on("deleteItemCart", async (productId: string) => {
                //     let deleteItem = await this.deleteItemCart(productId)
                //     if(deleteItem){
                //         socket.emit("receiveDelete", deleteItem)
                //     }
                // })

                socket.on("payCash", async (data: {
                    receiptId: string,
                    userId: string
                }) => {
                    let cashInfo = await this.cash(data.receiptId, data.userId)
                    if(cashInfo){
                        console.log("cashInfo", cashInfo);
                        
                         for(let i in this.clients){
                            if(this.clients[i].user.id == user.id){
                                this.clients[i].socket.emit("receiveCart", cashInfo[0])
                                this.clients[i].socket.emit("receiveReceipt", cashInfo[1])

                            }
                        }
                    }

                })
            }

        })
        
    }

    async findReceiptByAuthId(data: {
        userId: string | null,
        guestId: string | null
    }) {
        try{
            if(data.userId == null && data.guestId == null) return false;

            let receipts = await this.receipts.find({
                where: data.userId ? {
                    userId: data.userId
                } : {
                    guestId: data.guestId
                },
                relations: {
                    detail: {
                        option: {
                            product: true,
                            pictures: true
                        }
                    }
                }
            })

            if(!receipts) return false;

            if(receipts.length == 0) return false;

            return receipts;

        }catch(err){
            return false;
        }
        
    }

    async getCartByUserId(userId: string){
        try{
            let oldCart = await this.receipts.find({
                where: {
                    userId,
                    status: ReceiptStatus.SHOPPING
                },
                relations: {
                    detail: {
                        option: {
                            product: true,
                            pictures: true
                        }
                    }
                }
            })

            if(!oldCart || oldCart.length == 0 ){
                /* Create Cart */
                let newCartSchema = this.receipts.create({
                    userId
                })

                let newCart = await this.receipts.save(newCartSchema);

                if(!newCart) return false;

                let newCartRelation = await this.receipts.findOne({
                    where: {
                        id: newCart.id
                    },
                    relations: {
                        detail: {
                            option: {
                                product: true,
                                pictures: true
                            }
                        }
                    }
                })

                if(!newCartRelation) return false;
                
                return newCartRelation;

            }

            return oldCart[0];

        }catch(err){
            return false;
        }
    }

    async addToCart(newItem : {receiptId: string, optionId: string, quantity: number}){
        try{
            let items = await this.receiptDetail.find({
                where: {
                    receiptId: newItem.receiptId
                }
            })

            if(!items) return false;

            if(items.length == 0){
                await this.receiptDetail.save(newItem)
            }else{
                let check = items.find(item => item.optionId == newItem.optionId)

                if(check){
                    let itemUpdate = this.receiptDetail.merge(items.find(item => item.optionId == newItem.optionId), {
                        quantity: newItem.quantity
                    })
                    await this.receiptDetail.save(itemUpdate)

                }else{
                    await this.receiptDetail.save(newItem)
                }
            }

            let cart = await this.receipts.findOne({
                where: {
                    id: newItem.receiptId
                },
                relations: {
                    detail: {
                        option: {
                            product: true,
                            pictures: true
                        }
                    }
                }
            })

            if(!cart) return false;

            return cart;

        }catch(err){

        }
    }

    // async deleteItemCart(productId: string){
    //     try{
    //         let deleteItem = await this.receiptDetail.delete({
    //             id: productId
    //         })

    //         if(!deleteItem) return false;

    //         let result = await this.receiptDetail.find()

    //         if(!result) return false;
            
    //         return result;

    //     }catch(err){
    //         return false;
    //     }
    // }

    async cash(receiptId: string, userId: string){
        try{
            let nowCart = await this.receipts.findOne({
                where: {
                    id: receiptId
                }
            })
            if(!nowCart) return false;

            let cartUpdate = await this.receipts.merge(nowCart, {
                status: ReceiptStatus.PENDING
            })

            let cartResult = await this.receipts.save(cartUpdate);
            if(!cartResult) return false;

            /* Create New Cart */
            let newCart = await this.getCartByUserId(userId)
            if(!newCart) return false;

            let receipt = this.receipts.find({
                where: {
                    userId
                },
                relations: {
                    detail: {
                        option: {
                            product: true,
                            pictures: true
                        }
                    }
                }
            })
            if(!receipt) return false;
            return [newCart, receipt]

        }catch(err){
            return false
        }
    }

}