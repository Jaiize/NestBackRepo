import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  toCreate(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get('heavy')
  toGetCommentsByUser(@Req() req: Request) {
    return this.commentService.getCommentsByUser((req.user as User).id);
  }

  @Get('pull/:id')
  toGetByPost(@Param('id', ParseIntPipe) postId: number) {
    return this.commentService.getCommentsByPost(postId);
  }

  @Get('replies/:id')
  toGetReplies(@Param('id', ParseIntPipe) parentId: number) {
    return this.commentService.getReplies(parentId);
  }

  @Patch(':id')
  toUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  toRemove(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.remove(id);
  }
}
