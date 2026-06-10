import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Exclude, Expose } from 'class-transformer';

export enum Gender {
  MALE = 'm',
  FEMALE = 'f',
  UNDISCLOSE = 'u',
}

registerEnumType(Gender, { name: 'Gender' });

@ObjectType()
@Exclude()
export class UserObj {
  @Field()
  @Expose()
  id!: string;

  @Field()
  @Expose()
  name!: string;

  @Field()
  @Expose()
  email!: string;

  @Field()
  @Expose()
  username!: string;

  @Field()
  @Expose()
  picture!: string;

  @Field(() => Boolean)
  @Expose()
  isAdmin!: boolean;

  @Field(() => Boolean)
  @Expose()
  canPost!: boolean;

  @Field(() => Int)
  @Expose()
  age!: number;

  @Field(() => Date)
  @Expose({ name: 'created_at' })
  createdAt!: Date;

  @Field(() => Gender)
  gender!: Gender;
}
