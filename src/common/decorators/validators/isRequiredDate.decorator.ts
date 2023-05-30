import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsDate, IsNotEmpty } from 'class-validator';

export const IsRequiredDate = () => {
  return applyDecorators(IsDate(), Field(), IsNotEmpty());
};
