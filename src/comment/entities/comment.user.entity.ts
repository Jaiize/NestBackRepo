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
export class CommentUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  content!: string;

  @ManyToOne(() => Room, (room) => room.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_joiner' })
  room!: Room;

  @Column({ type: 'int', name: 'room_joiner' })
  @Index()
  roomId!: number;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_commented' })
  user!: User;

  @Column({ type: 'int', name: 'user_commented' })
  @Index()
  userId!: number;

  @Column({ type: 'int', nullable: true, name: 'parent_id' })
  @Index()
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

  @CreateDateColumn({ type: 'timestamp', update: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
