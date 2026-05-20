import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { CommentUser } from '../entities/comment.user.entity';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty()
  @IsNotEmpty()
  user!: User;

  @ApiProperty()
  @IsNotEmpty()
  room!: Room;

  @ApiProperty()
  parent!: CommentUser;
}