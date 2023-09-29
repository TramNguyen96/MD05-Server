import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerChats } from "./entities/customer.chat.entity";
import { Repository } from "typeorm";
import {CustomerChat} from './customer.chat.interface'


@Injectable()
export class CustomerChatService {
    constructor(
        @InjectRepository(CustomerChats)
        private readonly customerChatRepository: Repository<CustomerChats>
    ){}

    async findChatByUserId(userId: string){
        try{
            let chats = await this.customerChatRepository.find({
                where: {
                    replyToId: null,
                    userId
                }, 
                order: {
                    time: "ASC"
                },
                relations: {
                    user: true
                }
            })
            if(chats.length == 0){
                return false
            }
            return chats

        }catch(err){
            return false

        }
    }

    async createChat(chatRecord: CustomerChat){
        try{
            let chat = await this.customerChatRepository.save(chatRecord)
            
            if(!chat){
                return false
            }
            
            let chatList = await this.customerChatRepository.find({
                where: {
                    replyToId: null,
                    userId: chatRecord.userId
                }
            })

            if(chatList.length == 0){
                return false
            }

            return chatList;

        }catch(err){
            console.log("err", err)
            return false
        }
    }
}