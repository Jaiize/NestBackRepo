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
export class Follower {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  followerUser!: User;

  @Column({ type: 'varchar', name: 'follower_id' })
  @Index()
  followerId!: string;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  followingUser!: User;

  @Column({ type: 'varchar', name: 'following_id' })
  @Index()
  followingId!: string;

  @CreateDateColumn({ type: 'timestamp', update: false })
  @Index()
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt!: Date;
}
