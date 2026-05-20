import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentReactService } from './comment-react.service';
import { CreateCommentReactDto } from './dto/create-comment-react.dto';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

@Controller('api/react')
export class CommentReactController {
  constructor(private readonly commentReactService: CommentReactService) {}

  @Post('comment/:commentid/post')
  async toCreateCommentReact(
    @Param('commentid', ParseIntPipe) commentId: number,
    @Body() createCommentReactDto: CreateCommentReactDto,
    @Req() req: Request,
  ): Promise<{ action: string }> {
    return await this.commentReactService.createComReact(
      (req.user as User).id,
      commentId,
      createCommentReactDto,
    );
  }

  @Post('post/:roomid/post')
  async toCreatePostReact(
    @Param('roomid', ParseIntPipe) postId: number,
    @Body() createCommentReactDto: CreateCommentReactDto,
    @Req() req: Request,
  ): Promise<{ action: string }> {
    return await this.commentReactService.createPostReact(
      (req.user as User).id,
      postId,
      createCommentReactDto,
    );
  }

  // Where roomId serves as postId
  @Get('comment/:roomid')
  async toGetCommentsWithReactions(
    @Param('roomid', ParseIntPipe) roomId: number,
    @Req() req: Request,
  ) {
    return await this.commentReactService.getCommentsWithReactions(
      roomId,
      (req.user as User).id,
    );
  }

  @Get('comment/:parentid/replies')
  async toGetRepliesWithReactions(
    @Param('parentid', ParseIntPipe) parentId: number,
    @Req() req: Request,
  ) {
    return await this.commentReactService.getRepliesWithReactions(
      parentId,
      (req.user as User).id,
    );
  }

  @Get('postreact')
  async toGetPostWithReactions(@Req() req: Request) {
    return await this.commentReactService.getPostsWithReactions(
      (req.user as User).id,
    );
  }

  // subQueryOne
  @Get('getposts/reaction/:roomid')
  async subQueryOne(
    @Param('roomid', ParseIntPipe) roomId: number,
    @Req() req: Request,
  ) {
    return await this.commentReactService.subQueryOne(
      roomId,
      (req.user as User).id,
    );
  }
  
  // subQuerytwo
  @Get('getposts/reaction/more/:roomid')
  async subQueryTwo(
    @Param('roomid', ParseIntPipe) roomId: number,
    @Req() req: Request,
  ) {
    return await this.commentReactService.subQueryTwo(
      roomId,
      (req.user as User).id,
    );
  }
}
