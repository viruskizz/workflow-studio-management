import { Auth } from '@backend/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FdnetService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Auth)
    private repository: Repository<Auth>,
  ) {}

  getHello() {
    return this.configService.get('FDNET_APP_NAME');
  }

  getAuth() {
    return this.repository.find();
  }
}
