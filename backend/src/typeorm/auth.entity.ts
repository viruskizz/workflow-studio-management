import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

export enum AuthProvider {
  FDNET = 'FDNET',
  FDNET_SERVER = 'FDNET_SERVER',
}

@Entity({ name: 'auth' })
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  username: string;

  @Column()
  provider: AuthProvider;

  @Column({ type: 'text', nullable: true })
  token: string;

  @Column({ type: 'text', nullable: true })
  refeshtoken: string;

  @Column({ type: 'timestamp', nullable: true })
  issueAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Related to user
  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @OneToMany(() => User, (user) => user.id)
  user: User;
}
