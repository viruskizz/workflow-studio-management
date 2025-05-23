import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Project } from './project.entity';

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum TaskType {
  EPIC = 'EPIC',
  STORY = 'STORY',
  TASK = 'TASK',
  SUBTASK = 'SUBTASK',
}

@Entity({ name: 'tasks' })
@Tree('closure-table')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'demo' })
  summary: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'show an example project' })
  description?: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'DEMO-1' })
  code: string;

  @Column({ type: 'enum', enum: TaskType })
  type: TaskType;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  // component:

  // componentStatus:

  /*
  Relational column
  */
  @Column({ nullable: true })
  projectId?: number;

  @ManyToOne(() => Project, (p) => p.id)
  @JoinColumn()
  project: Project;

  @Column({ nullable: true })
  assigneeId?: number;

  @ManyToOne(() => User, (u) => u.id)
  assignee: User;

  @Column({ nullable: true })
  parentId?: number;

  // @ManyToOne(() => Task, (t) => t.children)
  @TreeParent()
  parent: Task;

  // @OneToMany(() => Task, (t) => t.parent)
  @TreeChildren()
  children: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
