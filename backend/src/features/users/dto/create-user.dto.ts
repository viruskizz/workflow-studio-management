import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { User } from '@backend/typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends PartialType(User) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abcde' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Test' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'example' })
  lastName: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'test@example.com' })
  email?: string;
}
