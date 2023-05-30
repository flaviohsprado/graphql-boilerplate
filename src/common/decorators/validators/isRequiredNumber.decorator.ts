import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Field } from '@nestjs/graphql';

export const IsRequiredNumber = () => {
  return applyDecorators(IsNumber(), Field(), IsNotEmpty());
};
