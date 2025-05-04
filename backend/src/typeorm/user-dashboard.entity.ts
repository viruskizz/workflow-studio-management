import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_dashboards' })
export class UserDashboard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'json', nullable: true })
  taskStats: {
    todo: number;
    inProgress: number;
    done: number;
    total: number;
  };

  @Column({ type: 'json', nullable: true })
  workingOn: {
    id: number;
    name: string;
    description: string;
    status: string;
    imageUrl?: string;
    updatedAt?: Date;
  }[];

  @Column({ type: 'json', nullable: true })
  workingWith: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    teams?: { id: number; name: string }[];
  }[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
