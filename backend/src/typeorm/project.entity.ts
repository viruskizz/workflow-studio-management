import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  /*
  Relational column
  */
  @ManyToOne(() => User, (user) => user.projects)
  owner: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
