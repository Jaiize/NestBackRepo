import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { CommentUser } from '../entities/comment.user.entity';

export class CreateCommentDto {
  @ApiProperty({ type: 'string', description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ type: 'string', description: 'User info: id' })
  @IsNotEmpty()
  user!: User;

  @ApiProperty({ type: 'string', description: 'Room commented on' })
  @IsNotEmpty()
  room!: Room;

  @ApiProperty({ type: 'string', description: 'Parent comment' })
  parent!: CommentUser;
}