import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [
    FileService,
    S3Client,
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          region: 'my_region_here',
          credentials: {
            accessKeyId: 'My_accessKeyId_here',
            secretAccessKey: 'My_secretAccessKey_here',
          },
        });
      },
    },
  ],
})
export class FileModule {}
