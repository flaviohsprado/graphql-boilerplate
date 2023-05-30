import { IsOptionalStringColumn } from '@decorators/columns/isOptionalStringColumn.decorator';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class File {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Field()
  @IsOptionalStringColumn()
  public originalname?: string;

  @Field({ nullable: true })
  @IsOptionalStringColumn()
  public ownerId: string;

  @Field({ nullable: true })
  @IsOptionalStringColumn()
  public ownerType: string;

  @Field()
  @IsOptionalStringColumn()
  public key: string;

  @Field()
  @IsOptionalStringColumn()
  public url: string;

  @Field(() => GraphQLUpload)
  @Column({ type: 'bytea', nullable: true })
  public buffer?: Buffer;
}
