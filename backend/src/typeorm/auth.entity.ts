import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AuthProvider {
  FDNET = 'FDNET',
}

@Entity({ name: 'auth' })
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  provider: AuthProvider;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  refeshtoken: string;

  @Column({ nullable: true })
  issueAt: Date;

  @Column({ nullable: true })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
