import { User } from 'src/user/entities/user.entity';
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

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  fileName!: string;

  @Column({ type: 'varchar', unique: true })
  s3Key!: string;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'user_file' })
  user!: User;

  @Column({ name: 'user_file', type: 'varchar'})
  ownerId!: string;

  @Column({ type: 'varchar', length: 20 })
  type!: string;

  @CreateDateColumn({ type: 'timestamp', update: false })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
