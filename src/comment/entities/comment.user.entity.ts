import { CommentReact } from 'src/comment-react/entities/comment-react.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['room'])
@Index(['user'])
@Index(['parent'])
export class CommentUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  content!: string;

  @ManyToOne(() => Room, (room) => room.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_joiner' })
  room!: Room;

  @Column({ type: 'int', name: 'room_joiner' })
  roomId!: number;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_commented' })
  user!: User;

  @Column({ type: 'int', name: 'user_commented' })
  userId!: number;

  @Column({ type: 'int', nullable: true, name: 'parent_id' })
  parentId!: number;

  @ManyToOne(() => CommentUser, (commentUser) => commentUser.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: CommentUser;

  @OneToMany(() => CommentReact, (com) => com.comment)
  likes!: CommentReact[];

  @OneToMany(() => CommentUser, (commentUser) => commentUser.parent)
  replies!: CommentUser[];

  // The three below properties seem useless
  likeCount!: number;

  dislikeCount!: number;

  userReaction!: 'like' | 'dislike' | null;

  @CreateDateColumn({ type: 'timestamp', update: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
