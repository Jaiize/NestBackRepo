import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReactionType } from '../entities/comment-react.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentReactDto {
  @ApiProperty({ enum: ReactionType })
  @IsNotEmpty()
  @IsEnum(ReactionType)
  type!: ReactionType;
}
