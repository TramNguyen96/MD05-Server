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
      return {
        status : true ,
        message:"Create new product success",
        data: newProduct
      }

    }catch(err){
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try{
      let products = await this.productRepository.find()
      return {
        status : true ,
        message:"Get all product success",
        data: products
      }

    }catch(err){
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }

  async findOne(id: string) {
    try{
      let product = await this.productRepository.findOneBy({id})
      return {
        status : true ,
        message:"Get product by id success",
        data: product
      }
    }catch(err){
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try{
      let productUpdate = await this.productRepository.update({id},updateProductDto )
      
      return {
        status : true ,
        message:"Update product by id success",
      }
    }catch(err){
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: string) {
    try{
      let product = await this.productRepository.delete({id})
      return {
        status : true ,
        message:"Get product by id success",
        data: product
      }
    }catch(err){
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }
}
