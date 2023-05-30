import { File } from '@entities/file.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserPresenter {
  @Field({ nullable: true })
  public id: string;

  @Field({ nullable: true })
  public username: string;

  @Field({ nullable: true })
  public email: string;

  @Field({ nullable: true })
  public accessToken?: string;

  @Field(() => File, { nullable: true })
  public file?: File;

  @Field({ nullable: true })
  public createdAt?: Date;

  @Field({ nullable: true })
  public updatedAt?: Date;

  constructor(user: UserPresenter) {
    Object.assign(this, user);
  }
}
