import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  /* Link TypeOrm */
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  
  async create(createCategoryDto: CreateCategoryDto) {
    try{
      let category = await this.categoriesRepository.save(createCategoryDto)
      return {
        status : true ,
        message :"Create Success",
        data    :  category
      }

    }catch(err){
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try{
      let categories = await this.categoriesRepository.find()
      return {
        status : true ,
        message :"Get all Success",
        data    :  categories
      }

    }catch(err){
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }

  async findById(id: string) {
    try{
      let category = await this.categoriesRepository.find({
        where: {
          id
        },
        relations:{
          products: {
            options: {
              product: {
                category:true
              },
              pictures: true
            }
          }
          
        }
      })
      return {
        status : true ,
        message:"Get product by id success",
        data: category
      }
    }catch(err){
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async search(searchKey: string) {
    try{
      const search = await this.categoriesRepository.find({
        where: {
          title: ILike(`%${searchKey}%`),
        },
      })
      return {
        status : true ,
        message :"Search Success",
        data    :  search
      }

    }catch(err){
      throw new  HttpException("Lỗi Model", HttpStatus.BAD_REQUEST)
    }
  }
}
