import { IsBooleanString, IsNumberString, IsOptional } from 'class-validator';

export class QueryTreeOptionInterface {
  @IsOptional()
  @IsBooleanString()
  all?: boolean;

  @IsOptional()
  @IsNumberString()
  parentId?: number;

  @IsOptional()
  @IsNumberString()
  depth?: number;
}
