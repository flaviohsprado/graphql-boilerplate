import { applyDecorators } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { Field } from '@nestjs/graphql';

export const IsOptionalNumber = () => {
  return applyDecorators(
    IsNumber({}),
    Field({
      nullable: true,
    }),
  );
};
