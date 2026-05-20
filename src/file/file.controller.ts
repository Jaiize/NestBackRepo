import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
// import { UpdateFileDto } from './dto/update-file.dto';

@Controller('api/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: '/uploads',
  //       filename(req, file, callback) {
  //         const uniq = Date.now() + Math.round(Math.random() * 1e9);
  //         const ext = file.originalname.split('.').pop();
  //         callback(null, `${uniq}.${ext}`);
  //       },
  //     }),
  //   }),
  // )
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async toUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
  ) {
    return await this.fileService.upload(file, createFileDto);
  }

  @Get(':id')
  toDownload(@Param('id') file: string, @Res() res: Response) {
    const result = this.fileService.download(file);
    res.set('Content-Disposition', `attachment: filename="${file}"`);
    res.set('Content-Type', 'application/octet-stream'); // For text file
    /**
     * Not tested yet!
     */
    // res.set('Content-Type', result[1] as string);
    res.send(result[0]);
  }

  // @Get()
  // findAll() {
  //   return this.fileService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.fileService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.fileService.update(+id, updateFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.fileService.remove(+id);
  // }
}
