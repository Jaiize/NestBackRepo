import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'The file name is mssing!' })
  fileName!: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'S3 key required!' })
  s3Key!: string;

  @ApiProperty()
  @IsNotEmpty({ message: "The author of this file's required!" })
  @MinLength(3, { message: "Author's name must be at least three characters!" })
  user!: User;

  @ApiProperty()
  @IsNotEmpty({ message: 'file type is required (e.g PDF, DOCX, JPEG)' })
  type!: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at!: Date;

  @ApiProperty()
  @IsNotEmpty()
  updated_at!: Date;
}
