import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { diskStorage } from 'multer';
// import { Multer } from 'multer';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
    private readonly s3Client: S3Client,
  ) {}

  async upload(file: Express.Multer.File, createFile: CreateFileDto) {
    const s3Key = `${crypto.randomUUID().replace(/([-])/g, '0')}-${file.originalname}`;
    // const date_name = new Date().toLocaleString('en-US', {
    //   day: 'numeric',
    //   month: 'numeric',
    //   year: 'numeric',
    //   hour: '2-digit',
    //   minute: 'numeric',
    //   second: '2-digit',
    // })
    // const s3Key = `${date_name}-${file.originalname}`;

    const params = {
      Bucket: 'My_AWS_bucket_here',
      Key: s3Key,
      Body: file.buffer,
      // ACL: 'public-read'
    };

    await this.s3Client.send(new PutObjectCommand(params));
    const fileEntity = new FileEntity();
    fileEntity.user = createFile.user;
    fileEntity.fileName = createFile.fileName || file.originalname;
    fileEntity.type = createFile.type || file.mimetype;
    fileEntity.s3Key = s3Key;
    return await this.fileRepo.save(fileEntity);
  }

  async download(file: string) {
    const fileExrtd = await this.fileRepo.findOne({
      where: [{ fileName: file }, { id: file }, { s3Key: file }],
    });

    if (fileExrtd) {
      const params = {
        Bucket: 'My_AWS_bucket_here',
        Key: fileExrtd.s3Key,
      };

      return await this.s3Client.send(new GetObjectCommand(params));
    } else {
      throw new NotFoundException('File not found!');
    }
  }

  uploadMulti(multi: Express.Request) {
    const f = multi.files;
  }

  // datePlusFileName(file: Express.Multer.File) {
  //   const storage = diskStorage({
  //     destination: '/uploads',
  //     filename(req, file, callback) {
  //       const uniq = Date.now() + Math.round(Math.random() * 1e9);
  //       const ext = file.originalname.split('.').pop();
  //       callback(null, `${uniq}.${ext}`);
  //     },
  //   });
  // }

  // findAll() {
  //   return `This action returns all file`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} file`;
  // }

  // update(id: number, updateFileDto: UpdateFileDto) {
  //   return `This action updates a #${id} file`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} file`;
  // }
}
