import { BaseEntity } from 'typeorm';
import { FileEntity } from './file.entity';
import { Project } from './project.entity';
import { Task } from './task.entity';
import { User } from './user.entity';
import { Team } from './team.entity';
import { TeamStage } from './team-stage.entity';
import { TeamMember } from './team-member.entity';
import { Auth } from './auth.entity';

const entities = [
  User,
  Project,
  FileEntity,
  Task,
  Team,
  TeamStage,
  TeamMember,
  Auth,
];

export { User, Project, FileEntity, Task, Team, TeamStage, TeamMember, Auth };

export default entities;
export class ConstructableBaseEntity extends BaseEntity {
  static construct<T>(this: new () => T, params: Partial<T>): T {
    return Object.assign(new this(), params);
  }
}
