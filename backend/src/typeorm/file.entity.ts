import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'files' })
export class FileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'demo.jpg' })
  name: string;

  @Column()
  @ApiProperty({ example: '/images/' })
  path: string;

  @Column()
  @ApiProperty({ example: '/images/demo.jpg' })
  filename: string;

  @Column()
  @ApiProperty({ example: 'http://localhost:3000/images/demo.jpg' })
  url: string;

  @Column()
  @ApiProperty({ example: 'image/jpeg' })
  type: string;

  @Column()
  @ApiProperty({ example: 2000 })
  size: number;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({ example: {} })
  metadata: any;

  /*
  Relational column
  */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
