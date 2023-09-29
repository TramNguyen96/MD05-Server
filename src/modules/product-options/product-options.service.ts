import { Injectable } from '@nestjs/common';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOption } from './entities/product-option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductOptionsService {

  constructor(@InjectRepository(ProductOption) private readonly optionRepository: Repository<ProductOption>){}

  async create(createProductOptionDto: CreateProductOptionDto) {
    try{
      let newOption = await this.optionRepository.save(createProductOptionDto)
      
      if(!newOption) 
      return {
        status: false,
        message : "Error while creating product option",
        data: null
      }

      let newOptionDetail = await this.optionRepository.findOne({
        where:{
          id: newOption.id
        },
        relations: {
          pictures: true
        }
      })

      if(newOptionDetail){
        return {
          status:true ,
          message:"New Option Created Successfully"  ,
          data: newOptionDetail
        }
      }else{
        return {
          status:false ,
          message :"Error while creating product option",
          data: null
        }
      }

    }catch(err){
      return {
          status:false ,
          message :"Error Service",
          data: null
        }
    }
  }

  
}
