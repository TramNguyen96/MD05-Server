import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException, Query } from '@nestjs/common';
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

   @Get("search")
  async search(@Res() res: Response, @Query('q') q: string) {
    try{

      if(q != undefined){
        let search = await this.productsService.search(q)
        return res.status(HttpStatus.OK).json(search)

      }
      let serviceRes = await this.productsService.findAll();
      return res.status(HttpStatus.OK).json(serviceRes)

    }catch(err){
      throw new  HttpException("Lỗi Controller", HttpStatus.BAD_REQUEST)
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

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      let serviceRes = await this.productsService.remove(id)
      // res.statusMessage = serviceRes.message
      res.status(serviceRes.data ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)
    } catch (err) {
      throw new HttpException('loi controller', HttpStatus.BAD_REQUEST)
    }
  }

 
}
