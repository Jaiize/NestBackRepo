import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentReactDto } from './dto/create-comment-react.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentReact, ReactionType } from './entities/comment-react.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CommentUser } from 'src/comment/entities/comment.user.entity';
import { PostReact } from './entities/post-react.entity';
import { Room } from 'src/rooms/entities/room.entity';

@Injectable()
export class CommentReactService {
  constructor(
    @InjectRepository(CommentReact)
    private readonly comReactRepo: Repository<CommentReact>,
    @InjectRepository(CommentUser)
    private readonly commentRepo: Repository<CommentUser>,
    @InjectRepository(PostReact)
    private readonly postReactRepo: Repository<PostReact>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  // Create comment's reaction
  async createComReact(
    userId: string,
    commentId: number,
    { type }: CreateCommentReactDto,
  ): Promise<{ action: string }> {
    const exists = await this.comReactRepo.findOne({
      where: { comment: { id: commentId }, user: { id: userId } },
    });

    if (!exists) {
      await this.comReactRepo.save({
        comment: { id: commentId },
        user: { id: userId },
        type,
      });
      return { action: 'Added' };
    }

    if (exists.type === type) {
      await this.comReactRepo.remove(exists);
      return { action: 'Removed' };
    }

    exists.type = type;
    await this.comReactRepo.save(exists);
    return { action: 'Switched' };
  }

  // Create post / room's reaction
  async createPostReact(
    userId: string,
    postId: number,
    { type }: CreateCommentReactDto,
  ): Promise<{ action: string }> {
    const exists = await this.postReactRepo.findOne({
      where: { room: { id: postId }, user: { id: userId } },
    });

    if (!exists) {
      await this.postReactRepo.save({
        room: { id: postId },
        user: { id: userId },
        type,
      });
      return { action: 'Added' };
    }

    if (exists.type === type) {
      await this.postReactRepo.remove(exists);
      return { action: 'Removed' };
    }

    exists.type = type;
    await this.postReactRepo.save(exists);
    return { action: 'Switched' };
  }

  // To get top-tier comments (comments pointing to the post directly not replies) with likes, dislikes and the current user's reaction
  async getCommentsWithReactions(roomId: number, userId: string) {
    const { entities, raw } = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.name', 'user.username'])
      .leftJoin('comment.likes', 'like')
      .addSelect(`COUNT(*) FILTER (WHERE like.type = :like)::int`, 'likeCount')
      .addSelect(
        `COUNT(*) FILTER (WHERE like.type = :dislike)::int`,
        'dislikeCount',
      )
      .addSelect(
        `MAX(CASE WHEN like.ownerId = :userId THEN like.type ELSE NULL END)`,
        'userReaction',
      )
      .setParameters({
        userId: userId,
        like: ReactionType.LIKE,
        dislike: ReactionType.DISLIKE,
      })
      .where('comment.roomId = :roomId', { roomId })
      .andWhere('comment.parentId IS NULL')
      .groupBy('comment.id')
      .addGroupBy('user.id')
      .addGroupBy('user.username')
      .addGroupBy('user.name')
      .orderBy('comment.createdAt', 'DESC')
      .getRawAndEntities();
    if (entities.length < 1 || raw.length < 1) {
      throw new NotFoundException('No comment and reaction made to this post!');
    }

    return entities.map((c, i) => ({
      commentId: c.id,
      content: c.content,
      roomId: c.roomId,
      parentId: c.parentId,
      createdAt: c.createdAt,
      userId: c.userId,
      username: c.user.username,
      name: c.user.name,
      likeCount: raw[i].likeCount as number,
      dislikeCount: raw[i].dislikeCount as number,
      userReaction: (raw[i].userReaction as string) || null,
    }));
  }

  // To get replies to a top-tier comment with likes, dislikes and the current user's reaction
  async getRepliesWithReactions(parentId: number, userId: string) {
    const { entities, raw } = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.name', 'user.username'])
      .leftJoin('comment.likes', 'like')
      .addSelect(`COUNT(*) FILTER (WHERE like.type = :like)::int`, 'likecount')
      .addSelect(
        `COUNT(*) FILTER (WHERE like.type = :dislike)::int`,
        'dislikecount',
      )
      .addSelect(
        `MAX(CASE WHEN like.ownerId = :userId THEN like.type ELSE NULL END)`,
        'userReaction',
      )
      .setParameters({
        userId: userId,
        like: ReactionType.LIKE,
        dislike: ReactionType.DISLIKE,
      })
      .where('comment.parentId = :parentId', { parentId })
      .groupBy('comment.id')
      .addGroupBy('user.id')
      .addGroupBy('user.username')
      .addGroupBy('user.name')
      .orderBy('comment.createdAt', 'DESC')
      .getRawAndEntities();
    if (entities.length < 1 || raw.length < 1) {
      throw new NotFoundException('No replies made to this comment!');
    }

    return entities.map((c, i) => ({
      commentId: c.id,
      content: c.content,
      roomId: c.roomId,
      parentId: c.parentId,
      createdAt: c.createdAt,
      userId: c.userId,
      username: c.user.username,
      name: c.user.name,
      likeCount: (raw[i].likecount as number) || 0,
      dislikeCount: (raw[i].dislikecount as number) || 0,
      userReaction: (raw[i].userReaction as string) || null,
    }));
  }

  // To get posts with reactions => likes, dislikes and the current user's reaction
  async getPostsWithReactions(userId: string) {
    const { entities, raw } = await this.roomRepo
      .createQueryBuilder('room')
      .leftJoin('room.postReact', 'react')
      .addSelect(`COUNT(*) FILTER (WHERE react.type = :like)::int`, 'likecount')
      .addSelect(
        `COUNT(*) FILTER (WHERE react.type = :dislike)::int`,
        'dislikecount',
      )
      .addSelect(
        `MAX(CASE WHEN react.ownerId = :userId THEN react.type ELSE NULL END)`,
        'userReaction',
      )
      .setParameters({
        userId: userId,
        like: ReactionType.LIKE,
        dislike: ReactionType.DISLIKE,
      })
      .groupBy('room.id')
      .orderBy('room.created_at', 'DESC')
      .getRawAndEntities();

    if (entities.length < 1 || raw.length < 1) {
      throw new NotFoundException('No reaction made to this post!');
    }

    return entities.map((c, i) => ({
      ...c,
      likeCount: (raw[i].likecount as number) || 0,
      dislikeCount: (raw[i].dislikecount as number) || 0,
      userReaction: (raw[i].userReaction as string) || null,
    }));
  }

  // Subquey one: using select, from => To get posts with reactions
  async subQueryOne(roomId: number, userId: string) {
    const { entities, raw } = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.name', 'user.username'])
      .addSelect((qb: SelectQueryBuilder<CommentReact>) => {
        return qb
          .select('COUNT(*)::int')
          .where('cr.type = :like')
          .andWhere('cr.commentId = comment.id')
          .from(CommentReact, 'cr');
      }, 'likecount')
      .addSelect((qb: SelectQueryBuilder<CommentReact>) => {
        return qb
          .select('COUNT(*)::int')
          .where('cr.type = :dislike')
          .andWhere('cr.commentId = comment.id')
          .from(CommentReact, 'cr');
      }, 'dislikecount')
      .addSelect((qb: SelectQueryBuilder<CommentReact>) => {
        return qb
          .select('cr.type')
          .where('cr.ownerId = :userId')
          .andWhere('cr.commentId = comment.id')
          .from(CommentReact, 'cr')
          .limit(1);
      }, 'userReaction')
      .setParameters({
        like: ReactionType.LIKE,
        dislike: ReactionType.DISLIKE,
        userId: userId,
      })
      .where('comment.roomId = :roomId', { roomId })
      .getRawAndEntities();

    if (entities.length < 1 || raw.length < 1) {
      throw new NotFoundException('No reaction made to this post!');
    }

    return entities.map((c, i) => ({
      commentId: c.id,
      content: c.content,
      roomId: c.roomId,
      parentId: c.parentId,
      createdAt: c.createdAt,
      userId: c.userId,
      username: c.user.username,
      name: c.user.name,
      likeCount: raw[i].likecount as number,
      dislikeCount: raw[i].dislikecount as number,
      userReaction: (raw[i].userReaction as string) || null,
    }));
  }

  // Subquery two: using FILTER, From, MAX(CASE WHEN THEN ELSE END) => To get posts with reactions
  async subQueryTwo(roomId: number, userId: string) {
    const { entities, raw } = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect(['user.name', 'user.username'])
      .addSelect((qb: SelectQueryBuilder<CommentReact>) => {
        return qb
          .select('COUNT(*) FILTER (WHERE cr.type = :like)::int')
          .where('cr.commentId = comment.id')
          .from(CommentReact, 'cr');
      }, 'likecount')
      .addSelect((qb: SelectQueryBuilder<CommentReact>) => {
        return qb
          .select('COUNT(*) FILTER (WHERE cr.type = :dislike)::int')
          .where('cr.commentId = comment.id')
          .from(CommentReact, 'cr');
      }, 'dislikecount')
      .addSelect((qb: SelectQueryBuilder<CommentReact>) => {
        return qb
          .select(
            'MAX(CASE WHEN cr.ownerId = :userId THEN cr.type ELSE NULL END)',
          )
          .where('cr.commentId = comment.id')
          .from(CommentReact, 'cr');
      }, 'userReaction')
      .setParameters({
        like: ReactionType.LIKE,
        dislike: ReactionType.DISLIKE,
        userId: userId,
      })
      .where('comment.roomId = :roomId', { roomId })
      .getRawAndEntities();

    if (entities.length < 1 || raw.length < 1) {
      throw new NotFoundException('No reaction made to this post!');
    }

    return entities.map((c, i) => ({
      commentId: c.id,
      content: c.content,
      roomId: c.roomId,
      parentId: c.parentId,
      createdAt: c.createdAt,
      userId: c.userId,
      username: c.user.username,
      name: c.user.name,
      likeCount: raw[i].likecount as number,
      dislikeCount: raw[i].dislikecount as number,
      userReaction: (raw[i].userReaction as string) || null,
    }));
  }
}
