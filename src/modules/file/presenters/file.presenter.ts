import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FilePresenter {
  @Field()
  public fieldname?: string;

  @Field()
  public originalname?: string;

  @Field()
  public url?: string;

  constructor(props: FilePresenter) {
    this.fieldname = props?.fieldname;
    this.originalname = props?.originalname;
    this.url = props?.url;
  }
}
