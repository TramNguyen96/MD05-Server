import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@Injectable()
export class UploadsService {
  create(createUploadDto: CreateUploadDto) {
    try{
      return {
        status: true,
        message: "Upload success"
      }
      
    }catch(err){
      return {
        status: false,
        message: "Upload failed"
      }
    }
  }

  findAll() {
    return `This action returns all uploads`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
