import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { Column, ColumnOptions } from 'typeorm';

export const IsOptionalNumberColumn = (props?: ColumnOptions) => {
  return applyDecorators(
    Field(() => Number, { nullable: true }),
    Column({
      type: 'decimal',
      transformer: {
        from(value: string) {
          return parseFloat(value);
        },
        to(value: number) {
          return value;
        },
      },
      nullable: true,
      ...props,
    }),
  );
};
