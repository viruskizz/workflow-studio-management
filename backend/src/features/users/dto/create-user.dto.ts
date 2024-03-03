import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {PartialType} from '@nestjs/mapped-types';
import {UsersEntity} from '@backend/typeorm';

export class CreateUserDto extends PartialType(UsersEntity) {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
}
