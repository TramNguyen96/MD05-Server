import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Res, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Response } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res: Response) {
    try{
      let serviceRes = await this.categoriesService.create(createCategoryDto);
      // res.charset = 'utf-8';
      // res.statusMessage = serviceRes.message;
      return res.status(HttpStatus.OK).json(serviceRes)

    }catch(err){
      throw new  HttpException("Lỗi Controller", HttpStatus.BAD_REQUEST)
    }
  }

  @Get()
  async findAll(@Res() res: Response, @Query('q') q: string) {
    try{

      if(q != undefined){
        let search = await this.categoriesService.search(q)
        return res.status(HttpStatus.OK).json(search)

      }
      let serviceRes = await this.categoriesService.findAll();
      return res.status(HttpStatus.OK).json(serviceRes)

    }catch(err){
      throw new  HttpException("Lỗi Controller", HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Res() res: Response) {
     try{
      let serviceRes = await this.categoriesService.findById(id)
      return res.status(serviceRes.status ? HttpStatus.OK : HttpStatus.ACCEPTED).json(serviceRes)

    }catch(err){
       throw new HttpException('Lỗi Controller', HttpStatus.BAD_REQUEST);
    }
  }
  
}
