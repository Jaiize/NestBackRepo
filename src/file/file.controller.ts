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
import { Readable } from 'stream';
import { diskStorage } from 'multer';

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
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: 50 * 1024 * 1024 } }),
  )
  async toUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
  ) {
    return await this.fileService.upload(file, createFileDto);
  }

  @Get(':file')
  async toDownload(@Param('file') file: string, @Res() res: Response) {
    const result = this.fileService.download(file);
    const contentType = await result.then((b) => b.ContentType);
    res.set('Content-Disposition', `attachment: filename="${file}"`);
    // res.set('Content-Type', 'application/octet-stream'); // For text file
    res.set('Content-Type', contentType); // For file
    /**
     * Not tested yet!
     */
    const body = await result.then((b) => b.Body);
    const stream = body as Readable;
    const chunks: Buffer[] = []
    for await (const chunk of stream){
      chunks.push(chunk)
    }
    res.json(Buffer.concat(chunks))
  }
}
