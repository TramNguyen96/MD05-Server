import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    try{
  
      let serviceRes = await this.productsService.create(createProductDto)

      return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)

    }catch(err){
      console.log("err", err);
       throw new HttpException('Lỗi Controller', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try{
      let serviceRes = await this.productsService.findAll()
      return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)

    }catch(err){
       throw new HttpException('Lỗi Controller', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':productId')
  async findById(@Res() res: Response, @Param('productId') productId: string) {
    try{
      let serviceRes = await this.productsService.findById(productId)
      return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)

    }catch(err){
       throw new HttpException('Lỗi Controller', HttpStatus.BAD_REQUEST);
    }
  }
}
