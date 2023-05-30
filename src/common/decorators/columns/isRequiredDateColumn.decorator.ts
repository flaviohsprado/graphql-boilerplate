/* istanbul ignore file */
import { applyDecorators } from '@nestjs/common';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Column, ColumnOptions } from 'typeorm';

export const IsRequiredDateColumn = (props?: ColumnOptions) => {
  return applyDecorators(
    Column({ type: 'date', ...props }),
    IsDate(),
    IsNotEmpty({
      message: '$property must not be empty',
    }),
  );
};
