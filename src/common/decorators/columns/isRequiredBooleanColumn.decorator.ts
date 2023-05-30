import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Column, ColumnOptions } from 'typeorm';

export const IsRequiredBooleanColumn = (props?: ColumnOptions) => {
  return applyDecorators(
    Column({ default: false, ...props }),
    IsBoolean(),
    Field(),
    IsNotEmpty({
      message: '$property must not be empty',
    }),
  );
};
