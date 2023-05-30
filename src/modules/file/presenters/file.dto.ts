import { IsOptionalString } from '@decorators/validators/isOptionalString.decorator';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateFileDTO {
  @IsOptionalString()
  ownerId?: string;

  @IsOptionalString()
  ownerType?: string;

  @IsOptionalString()
  fieldname?: string;

  @IsOptionalString()
  originalname?: string;

  @IsOptionalString()
  encoding?: string;

  @IsOptionalString()
  mimetype?: string;

  @IsOptionalString()
  key?: string;

  @IsOptionalString()
  url?: string;

  @Field(() => GraphQLUpload)
  buffer?: Uint8Array;

  constructor(props: CreateFileDTO) {
    Object.assign(this, props);
  }
}
