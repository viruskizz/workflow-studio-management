import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
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
  @ApiProperty({ example: 'abcde@example.com' })
  email: string;
}
