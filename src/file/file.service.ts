import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from 'src/S3Config';
import { diskStorage } from 'multer';
// import { Multer } from 'multer';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
  ) {}

  async upload(file: Express.Multer.File, createFile: CreateFileDto) {
    const s3Key = `${crypto.randomUUID().replace(/([-])/g, '0')}-${file.originalname}`;

    const params = {
      Bucket: 'My_AWS_bucket_here',
      Key: s3Key,
      Body: file.buffer,
      // ACL: 'public-read'
    };

    await s3Client.send(new PutObjectCommand(params));
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

      return await s3Client.send(new GetObjectCommand(params));
    } else {
      throw new NotFoundException('File not found!');
    }
  }

  // uploadMulti(multi: Express.Request) {
  //   const f = multi.files;
  //   for (const i in f) {

  //   }
  // }
}
