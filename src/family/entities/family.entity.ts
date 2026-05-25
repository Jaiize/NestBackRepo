import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity()
export class Family {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', array: true, nullable: true })
  brothers!: string[];

  @Column({ type: 'varchar', length: 30, nullable: true })
  mother!: string;

  @OneToOne(() => User, (user) => user.family, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  user!: User;

  @Column({ type: 'varchar', name: 'family_id' })
  @Index()
  ownerId!: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  sisters!: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  children!: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  maleCousins!: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  femaleCousins!: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  aunts!: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  uncles!: string[];

  @CreateDateColumn({ type: 'timestamp', update: false })
  @Index()
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
