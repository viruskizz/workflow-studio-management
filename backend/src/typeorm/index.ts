import { UsersEntity } from './users.entity';
import { BaseEntity } from 'typeorm';

const entities = [UsersEntity];

export { UsersEntity };
export default entities;

export class ConstructableBaseEntity extends BaseEntity {
  static construct<T>(this: new () => T, params: Partial<T>): T {
    return Object.assign(new this(), params);
  }
}
