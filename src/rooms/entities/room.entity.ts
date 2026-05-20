import { PostReact } from 'src/comment-react/entities/post-react.entity';
import { CommentUser } from 'src/comment/entities/comment.user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Status {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  INUSE = 'In-use',
  REAPPRAISAL = 'reappraisal',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 3, nullable: false })
  roomNumber!: string;

  @Column({ type: 'varchar', nullable: false })
  roomType!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  amenities!: string;

  @Column({ type: 'varchar', nullable: true })
  photos!: string;

  @OneToMany(() => CommentUser, (commentUser) => commentUser.room)
  comments!: Room[];

  @OneToMany(() => PostReact, (postReact) => postReact.room)
  postReact!: PostReact[];

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'date' })
  checkinTime!: Date;

  @Column({ type: 'date' })
  checkoutTime!: Date;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'enum', enum: Status, default: Status.AVAILABLE })
  status!: Status;

  @CreateDateColumn({ type: 'timestamp', update: false })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
