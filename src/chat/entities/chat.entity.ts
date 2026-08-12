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
@Index(['roomId', 'userId'])
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  message!: string;

  @Column({ type: 'varchar', nullable: true })
  clientId!: string;

  @ManyToOne(() => User, (user) => user.chats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender' })
  user!: User;

  @Column({ type: 'varchar', name: 'sender' })
  @Index()
  userId!: string;

  @Column({ type: 'varchar' })
  @Index()
  roomId!: string;

  @ManyToOne(() => Chat, (chat) => chat.replies, { nullable: true })
  @JoinColumn({ name: 'parent_to_replies' })
  parentChat!: Chat;

  @Column({ type: 'varchar', name: 'parent_to_replies', nullable: true })
  parentId!: string;

  @OneToMany(() => Chat, (chat) => chat.parentChat)
  replies!: Chat[];

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @CreateDateColumn({ type: 'timestamp', update: false })
  created_at!: Date;
}
