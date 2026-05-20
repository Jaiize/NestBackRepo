import { Family } from 'src/family/entities/family.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Follower } from './follower.entity';
import { FileEntity } from 'src/file/entities/file.entity';
import { CommentUser } from 'src/comment/entities/comment.user.entity';
import { CommentReact } from 'src/comment-react/entities/comment-react.entity';
import { PostReact } from 'src/comment-react/entities/post-react.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 20 })
  username!: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  picture!: string;

  @Column({ type: 'int' })
  age!: number;

  @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
  gender!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @OneToMany(() => Follower, (follow) => follow.followingUser)
  followers!: Follower[];

  @OneToMany(() => Follower, (follow) => follow.followerUser)
  following!: Follower[];

  followersCount!: number;

  followingCount!: number;

  @OneToMany(() => FileEntity, (file) => file.user)
  files!: FileEntity[];

  @OneToOne(() => Family, (family) => family.user)
  family!: Family;

  @OneToMany(() => CommentUser, (commentUser) => commentUser.user)
  comments!: CommentUser[];

  @OneToMany(() => CommentReact, (commentReact) => commentReact.user)
  commentlikes!: CommentReact[];

  @OneToMany(() => PostReact, (postReact) => postReact.user)
  postlikes!: PostReact[];

  @CreateDateColumn({ type: 'timestamp', update: false })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean;

  @Column({ type: 'boolean', default: false })
  canPost!: boolean;
}

//  @VirtualColumn({
//     query: (alias) =>
//       `SELECT COUNT(*) FROM user_follow WHERE user_follow.user_id = ${alias}.id`,
//   })
//   followersCount!: number;

//   @VirtualColumn({
//     query: (alias) =>
//       `SELECT COUNT(*) FROM user_follow WHERE user_follow.follower_id = ${alias}.id`,
//   })
//   followingCount!: number;
