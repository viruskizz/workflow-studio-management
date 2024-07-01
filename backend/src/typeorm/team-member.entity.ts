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

@Entity({ name: 'team_members' })
export class TeamMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  teamId?: number;

  @Column({ nullable: true })
  userId?: number;

  @ManyToOne(() => User, (u) => u.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Team, (u) => u.id)
  @JoinColumn()
  team: Team;
}
