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

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try{
      let serviceRes = await this.productsService.findOne(id)
      return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)

    }catch(err){
       throw new HttpException('Lỗi Controller', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res: Response) {
    try{
      let serviceRes = await this.productsService.update(id, updateProductDto )
      return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes.message)

    }catch(err){
       throw new HttpException('Lỗi Controller', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
     try{
      let serviceRes = await this.productsService.remove(id)
      return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)

    }catch(err){
       throw new HttpException('Lỗi Controller', HttpStatus.BAD_REQUEST);
    }
  }
}
