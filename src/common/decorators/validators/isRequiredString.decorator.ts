import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { Field } from '@nestjs/graphql';

export const IsRequiredString = () => {
  return applyDecorators(IsString(), Field(), IsNotEmpty());
};
