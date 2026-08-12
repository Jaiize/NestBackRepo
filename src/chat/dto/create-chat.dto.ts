import { IsNotEmpty, IsString } from 'class-validator';
import { Chat } from '../entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    type: 'string',
    description: 'Message Body',
    example: 'Hello Room',
  })
  @IsString()
  message!: string;

  @ApiProperty({ type: 'string', description: 'The Room id' })
  @IsNotEmpty()
  roomId!: string;

  @ApiProperty({ type: 'string', description: 'The user for relation' })
  @IsNotEmpty()
  user!: User;

  @ApiProperty({
    type: 'string',
    description: 'The Parent Chat id for relation',
  })
  parentChat!: Chat;
}
