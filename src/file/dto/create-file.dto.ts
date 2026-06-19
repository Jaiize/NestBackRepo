import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateFileDto {
  @ApiProperty({ type: 'string', description: 'The uploading-file name' })
  @IsString()
  @IsNotEmpty({ message: 'The file name is mssing!' })
  fileName!: string;

  @ApiProperty({
    type: 'string',
    description: 'The s3Key created for this file',
  })
  @IsNotEmpty({ message: 'S3 key required!' })
  s3Key!: string;

  @ApiProperty({ description: 'User who uploaded this file' })
  @IsNotEmpty({ message: "The author of this file's required!" })
  @MinLength(3, { message: "Author's name must be at least three characters!" })
  user!: User;

  @ApiProperty({
    description: 'MimeType to the file',
    type: 'string',
    example: 'image/jpeg',
  })
  @IsNotEmpty({ message: 'file type is required (e.g PDF, DOCX, JPEG)' })
  type!: string;

  @ApiProperty({ type: 'string', description: 'Created date' })
  @IsNotEmpty()
  created_at!: Date;

  @ApiProperty({ type: 'string', description: 'Updated date' })
  @IsNotEmpty()
  updated_at!: Date;
}
