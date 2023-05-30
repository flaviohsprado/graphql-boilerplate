import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { ColumnOptions, UpdateDateColumn } from 'typeorm';

export const IsOptionalUpdateDateColumn = (props?: ColumnOptions) => {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    UpdateDateColumn({ nullable: false, ...props }),
  );
};
