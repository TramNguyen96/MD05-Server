import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionPicture } from './entities/option-picture.entity';
import { Repository } from 'typeorm';
import { Pictures } from './dto/pictures-option-picture.dto';

@Injectable()
export class OptionPicturesService {

  constructor(@InjectRepository(OptionPicture) private readonly optionPictureRepository: Repository<OptionPicture>){}

  async create(pictures: Pictures[]) {
    try{
      for(let picture of pictures){
        await this.optionPictureRepository.save(picture);
      }

      let listPictures = await this.optionPictureRepository.find({
        where: {
          optionId: pictures[0].optionId
        }
      })

      if(listPictures){
        return {
          status : true,
          message: "Create option picture success",
          data: listPictures
        }
      }else{
        return {
          status : false ,
          message: "Create option picture error",
          data: null
        }
      }

    }catch(err){
      return {
          status : false ,
          message: "Error Service",
          data: null
        }
    }
  }

  
}
