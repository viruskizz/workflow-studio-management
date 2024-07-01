import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TeamStage } from './team-stage.entity';

@Entity({ name: 'teams' })
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  leaderId?: number;

  @ManyToOne(() => User, (u) => u.id)
  @JoinColumn()
  leader: User;

  @OneToMany(() => TeamStage, (stage) => stage.team)
  stages: TeamStage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
