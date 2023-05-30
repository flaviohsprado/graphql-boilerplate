import { applyDecorators } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { Field } from '@nestjs/graphql';

export const IsOptionalString = () => {
  return applyDecorators(
    IsOptional(),
    IsString(),
    Field({
      nullable: true,
    }),
  );
};
