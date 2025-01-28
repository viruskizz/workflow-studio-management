import { IsNumberString, IsOptional } from 'class-validator';

export class QueryTreeOptionInterface {
  @IsOptional()
  @IsNumberString()
  parentId?: number;

  @IsOptional()
  @IsNumberString()
  depth?: number;
}
