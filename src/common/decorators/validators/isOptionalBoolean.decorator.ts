import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

export const IsOptionalBoolean = () => {
  return applyDecorators(
    IsOptional(),
    IsBoolean(),
    Field({
      nullable: true,
    }),
  );
};
