import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentUser } from './entities/comment.user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentUser)
    private readonly commentRepo: Repository<CommentUser>,
  ) {}
  async create({
    content,
    room,
    parent,
    user,
  }: CreateCommentDto): Promise<CommentUser> {
    const comment = new CommentUser();
    comment.content = content;
    comment.parent = parent;
    comment.room = room;
    comment.user = user;
    return await this.commentRepo.save(comment);
  }

  // Too heavy: Gets all comments with replies, however no count on likes or dislikes
  async getCommentsByUser(userId: string) {
    // Not using raw
    const { entities } = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.username', 'user.name'])
      .leftJoin('comment.replies', 'replies')
      .addSelect(['replies.id', 'replies.content', 'replies.parentId'])
      .leftJoin('replies.user', 'responders')
      .addSelect([
        'responders.name',
        'responders.username',
        'responders.id',
        'responders.created_at',
      ])
      .where('comment.userId = :userId', { userId })
      .getRawAndEntities();

    if (entities.length < 1) {
      throw new NotFoundException('No comments made to this post!');
    }

    return entities.map((s) => ({
      commentId: s.id,
      content: s.content,
      parentId: s.parentId,
      createdAt: s.createdAt,
      username: s.user.username,
      name: s.user.name,
      userId: s.userId,
      replies: s.replies.map((k) => ({
        commentId: k.id,
        content: k.content,
        parentId: k.parentId,
        userId: k.user.id,
        username: k.user.username,
        name: k.user.name,
        createdAt: k.user.created_at,
      })),
    }));
  }

  // No count of likes or dislikes
  async getCommentsByPost(postId: number): Promise<CommentUser[]> {
    const fetched = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.username', 'user.name'])
      .where('comment.roomId = :roomId', { roomId: postId })
      .getMany();
    if (fetched.length < 1) {
      throw new NotFoundException('No comments made to this post!');
    }
    return fetched;
  }

  // No count of likes or dislikes
  async getReplies(parentId: number): Promise<CommentUser | CommentUser[]> {
    const fetched = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.id', 'user.name', 'user.username'])
      .where('comment.parentId = :parentId', { parentId })
      .getMany();
    if (fetched.length < 1) {
      throw new NotFoundException('No replies made to this comment!');
    }
    return fetched;
  }

  async update(
    id: number,
    { content }: UpdateCommentDto,
  ): Promise<CommentUser> {
    const fetched = await this.commentRepo.findOneBy({ id });
    if (!fetched) {
      throw new NotFoundException(`Comment with id: ${id} does not exist!`);
    }
    fetched.content = content!;
    return await this.commentRepo.save(fetched);
  }

  async remove(id: number): Promise<CommentUser> {
    const fetched = await this.commentRepo.findOneBy({ id });
    if (!fetched) {
      throw new NotFoundException(`Comment with id: ${id} does not exist!`);
    }
    return await this.commentRepo.remove(fetched);
  }
}
