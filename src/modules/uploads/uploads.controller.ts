import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from '../../firebase'

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadService: UploadsService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('imgs'))
  async create(@Body() body: any, @UploadedFiles() imgs: Array<Express.Multer.File>) {
    try{
      let url = await uploadFileToStorage(imgs, "many", imgs[1].buffer)
      return {message: "Ok"}
    }catch(err){
      return {message: "Failed"};
      
    }
    // console.log("imgs", imgs)
    // console.log("url", url)
  }

  // @Post()
  // @UseInterceptors(FileInterceptor('avatar'))
  // async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
  //   // console.log("file", file)
  //   // console.log("body", JSON.parse(body.user).email);

  //   let url = await uploadFileToStorage(file, "test", file.buffer)
  //   console.log("url", url)
  //   return "Ok"
  // }
}
