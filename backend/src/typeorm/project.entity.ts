import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from './task.entity';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
  @PrimaryColumn()
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

  @Column({ type: 'jsonb', default: { last: 0 } })
  @ApiProperty({ example: '{last: 0}' })
  metadata: {
    last: number;
  };
  /*
  Relational column
  */
  @ManyToOne(() => User, (user) => user.projects)
  owner: User;

  @OneToMany(() => Task, (task) => task.id)
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
