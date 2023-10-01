import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

    constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  
  async create(createProductDto: CreateProductDto) {
    try{

      let newProduct = await this.productRepository.save(createProductDto)

      if(!newProduct){
        return {
          status : false ,
          message:"Create new product failed",
          data: null
        }
      }

      let newProductDetail = await this.productRepository.findOne({
          where: {
            id: newProduct.id
          },
          relations: {
            category: true,
            options: {
              pictures: true
            }
          }
        })

        if(newProductDetail){
          return {
            status : true ,
            message:"Create new product success",
            data: newProductDetail
          }
        }else{
        return {
          status : false ,
          message:"Create new product failed",
          data: null
        }
      }
        
        
      }catch(err){
      console.log("err", err);
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }

  }

  async findAll() {
    try{
      let products = await this.productRepository.find({
        relations: {
          options: {
            pictures: true
          }
        }
      })
      if(products){
          return {
            status : true ,
            message:"Get all product success",
            data: products
          }
      }else{
        return {
          status : false ,
          message:"Get all product failed",
          data: null
        }
      }
      

    }catch(err){
      
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }

  async findById(productId: string) {
    try{
      let products = await this.productRepository.findOne({
        where: {
          id: productId
        },
        relations:{
          options: {
            product: true,
            pictures: true
          }
        }
      })
      if(products){
          return {
            status : true ,
            message:"Get product by id success",
            data: products
          }
      }else{
        return {
          status : false ,
          message:"Get product by id failed",
          data: null
        }
      }
      

    }catch(err){
      
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }

  
}
