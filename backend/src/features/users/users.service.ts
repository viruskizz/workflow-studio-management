import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@backend/typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email } = createUserDto;
    if (await this.findByUsername(username)) {
      throw new BadRequestException('user already exists');
    }
    if (await this.findByEmail(email)) {
      throw new BadRequestException('email already used');
    }
    const hashedPassword = await argon2.hash(createUserDto.password);
    const user = { ...createUserDto, password: hashedPassword };
    return this.usersRepository.save(user).catch((e) => console.log(e));
  }

  findAll() {
    return this.usersRepository.find();
  }

  findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
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
