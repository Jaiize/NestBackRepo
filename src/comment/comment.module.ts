import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentUser } from './entities/comment.user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CommentUser])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
