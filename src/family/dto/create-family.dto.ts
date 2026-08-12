import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateFamilyDto {
  @IsString()
  @ApiProperty()
  mother!: string;

  @ApiProperty()
  brothers!: string[];

  @ApiProperty()
  sisters!: string[];

  @ApiProperty()
  children!: string[];

  @ApiProperty()
  ownerId!: string;

  @ApiProperty()
  user!: User;
}
