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
import { ApiProperty } from '@nestjs/swagger';
import { Task } from './task.entity';

export enum ProjectStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'demo' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'show an example project' })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({ example: '' })
  imageUrl?: string;

  @Column()
  @ApiProperty({ example: 'DEMO' })
  key: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: 'TODO' })
  @ApiProperty({ example: 'TODO' })
  status: ProjectStatus;

  @Column({ type: 'jsonb', default: { last: 0 } })
  @ApiProperty({ example: '{last: 0}' })
  metadata: {
    last: number;
  };
  /*
  Relational column
  */
  @Column({ name: 'leader_id', nullable: true })
  @ApiProperty({ example: 1 })
  leaderId?: number;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'leader_id' })
  leader?: User | null;

  @OneToMany(() => Task, (task) => task.id)
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
