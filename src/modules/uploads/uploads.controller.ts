import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileToStorage } from '../../firebase'

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadService: UploadsService) { }

  @Post('/many')
  @UseInterceptors(FilesInterceptor('imgs'))
  async create2(@Body() body: any, @UploadedFiles() imgs: Array<Express.Multer.File>) {
    console.log("imgs", imgs)
    let url = await uploadFileToStorage(imgs, "many", imgs[1].buffer)
    console.log("url", url)
    return {message: "Ok"};
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
