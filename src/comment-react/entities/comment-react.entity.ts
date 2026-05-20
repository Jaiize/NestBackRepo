import { CommentUser } from 'src/comment/entities/comment.user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity()
@Unique(['ownerId', 'commentId'])
export class CommentReact {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.commentlikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_who_reacted' })
  user!: User;

  @Column({ type: 'varchar', name: 'user_who_reacted' })
  @Index()
  ownerId!: string;

  @ManyToOne(() => CommentUser, (commentUser) => commentUser.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_reacted_on' })
  comment!: CommentUser;

  @Column({ type: 'varchar', name: 'comment_reacted_on' })
  @Index()
  commentId!: number;

  @Column({ type: 'enum', enum: ReactionType })
  type!: ReactionType;

  @CreateDateColumn({ type: 'timestamp', update: false })
  createdAt!: Date;
}
