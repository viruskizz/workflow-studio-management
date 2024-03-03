import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from '@backend/typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}
  create(createUserDto: CreateUserDto) {
    // const user = new UsersEntity();
    const user = UsersEntity.create(createUserDto);
    return this.usersRepository.save(user).catch((e) => console.log(e));
  }

  findAll() {
    return this.usersRepository.find();
  }

  findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  update(id: number, data: UpdateUserDto) {
    return this.usersRepository.update(id, data);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
