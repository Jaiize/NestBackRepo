import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Index(['followerUser', 'followingUser'], { unique: true })
@Index(['followingUser', 'createdAt'])
@Index(['followerUser', 'createdAt'])
export class Follower {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  followerUser!: User;

  @Column({ type: 'varchar', name: 'follower_id' })
  followerId!: string;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  followingUser!: User;

  @Column({ type: 'varchar', name: 'following_id' })
  followingId!: string;

  @CreateDateColumn({ type: 'timestamp', update: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt!: Date;
}
