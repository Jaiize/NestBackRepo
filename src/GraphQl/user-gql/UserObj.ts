import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNDISCLOSE = 'undefine',
}

registerEnumType(Gender, { name: 'Gender' });

@ObjectType()
@Exclude()
export class UserObj {
  @ApiProperty({
    example: 'aevd-5dfoc-sd8d5',
    description: "The user's id",
    type: 'string',
  })
  @Field()
  @Expose()
  id!: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The user full name',
    type: 'string',
  })
  @Field()
  @Expose()
  name!: string;

  @ApiProperty({
    example: 'JohnDoe@example.com',
    description: 'The user email',
    type: 'string',
  })
  @Field()
  @Expose()
  email!: string;

  @ApiProperty({ example: 'John_Doe', description: 'Username', type: 'string' })
  @Field()
  @Expose()
  username!: string;

  @ApiProperty({ type: 'string', description: 'Avatar or picture' })
  @Field()
  @Expose()
  picture!: string;

  @Field(() => Boolean)
  @Expose()
  isAdmin!: boolean;

  @Field(() => Boolean)
  @Expose()
  canPost!: boolean;

  @ApiProperty({ type: 'number', description: "Client's age" })
  @Field(() => Int)
  @Expose()
  age!: number;

  @ApiProperty({ type: 'number', description: 'Date created' })
  @Field(() => Date)
  @Expose({ name: 'created_at' })
  createdAt!: Date;

  @Field(() => Gender)
  gender!: Gender;
}
