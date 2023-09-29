import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { OptionPicturesService } from './option-pictures.service';
import { CreateOptionPictureDto } from './dto/create-option-picture.dto';
import { UpdateOptionPictureDto } from './dto/update-option-picture.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Pictures } from './dto/pictures-option-picture.dto';
import { uploadFileToStorage } from 'src/firebase';

@Controller('option-pictures')
export class OptionPicturesController {
  constructor(private readonly optionPicturesService: OptionPicturesService) {}

  @Post(":optionId")
  @UseInterceptors(FilesInterceptor('pictures'))
  async create(@UploadedFiles() files: Array<Express.Multer.File>, @Param('optionId') optionId: string, @Res() res: Response) {
   try{
    console.log("optionId", optionId)
    console.log("files", files)

    let pictures: Pictures[] = [];

    for(let i in files){
      let url = await uploadFileToStorage(files[i], 'products', files[i].buffer)
      pictures.unshift({
        optionId,
        icon: url ? url : "https://static.thenounproject.com/png/504708-200.png"
      })
      
    }

    let serviceRes = await this.optionPicturesService.create(pictures);
    return res.status(serviceRes.status ? 200 : 213).json(serviceRes)

   }catch(err){
    return res.status(500).json({
      message: "Controller Error"
    })
   }
  }

  
}
