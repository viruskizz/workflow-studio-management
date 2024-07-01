import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Team } from './team.entity';
import { TaskStatus } from './task.entity';

@Entity({ name: 'team_stages' })
export class TeamStage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  taskStatus: TaskStatus;

  @Column()
  order: number;

  @Column({ nullable: true })
  teamId?: number;

  @ManyToOne(() => User, (u) => u.id)
  @JoinColumn()
  team: Team;
}
