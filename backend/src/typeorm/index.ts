import { FileEntity } from './file.entity';
import { Project } from './project.entity';
import { User } from './user.entity';
import { BaseEntity } from 'typeorm';

const entities = [User, Project, FileEntity];

export { User, Project, FileEntity };

export default entities;
export class ConstructableBaseEntity extends BaseEntity {
  static construct<T>(this: new () => T, params: Partial<T>): T {
    return Object.assign(new this(), params);
  }
}
