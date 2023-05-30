import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export const IsRequiredBoolean = () => {
  return applyDecorators(IsBoolean(), Field(), IsNotEmpty());
};
