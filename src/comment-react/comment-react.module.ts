import { Module } from '@nestjs/common';
import { CommentReactService } from './comment-react.service';
import { CommentReactController } from './comment-react.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentReact } from './entities/comment-react.entity';
import { CommentUser } from 'src/comment/entities/comment.user.entity';
import { PostReact } from './entities/post-react.entity';
import { Room } from 'src/rooms/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentReact, CommentUser, PostReact, Room]),
  ],
  controllers: [CommentReactController],
  providers: [CommentReactService],
})
export class CommentReactModule {}
