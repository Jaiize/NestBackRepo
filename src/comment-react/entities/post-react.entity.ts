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
import { ReactionType } from './comment-react.entity';


@Entity()
@Unique(['user', 'room'])
export class PostReact {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.postlikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_who_post_reacted' })
  user!: User;

  @Column({ type: 'varchar', name: 'user_who_post_reacted' })
  @Index()
  ownerId!: string;

  @ManyToOne(() => Room, (room) => room.postReact, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_reacted_on' })
  room!: Room;

  @Column({ type: 'varchar', name: 'post_reacted_on' })
  @Index()
  postId!: number;

  @Column({ type: 'enum', enum: ReactionType })
  @Index()
  type!: ReactionType;

  @CreateDateColumn({ type: 'timestamp', update: false })
  @Index()
  createdAt!: Date;
}
