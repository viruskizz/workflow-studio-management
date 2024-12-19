import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface QueryOptionInterface {
  fields?: string[];
  select?: { [k: string]: boolean };
  filter?: string;
  where?: { [k: string]: any };
  limit?: number;
  offset?: number;
}

const fieldsToSelects = (fields: string[]) => {
  if (!fields) {
    return;
  }
  const select: object = {};
  fields.forEach((el: string) => {
    select[el] = true;
  });
  return select;
};

export const QueryOption = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { query } = request;
    let fields = [];
    if (query.fields) {
      fields = query.fields?.split(',').map((el: string) => el.trim());
    }
    return {
      fields,
      select: fieldsToSelects(fields),
      limit: query.limit,
      offset: query.offset,
    };
  },
);
