import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { Gender } from './UserObj';
import {
  IsAlphanumeric,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

registerEnumType(Gender, { name: 'Gender' });

@InputType()
export class UserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(9, { message: 'Name cannot be less than nine characters!' })
  name!: string;

  @Field()
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: "Email field can't be empty" })
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast three characters!' })
  @IsAlphanumeric('en-US', {
    message: 'Username must be alphaNumeric characters!',
  })
  username!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minLowercase: 2,
      minUppercase: 1,
      minSymbols: 0,
    },
    {
      message:
        'Password too weak. Password should be minimum of 8 Characters, one digit, two lowerCase, one upperCase',
    },
  )
  password!: string;

  @Field({ nullable: true })
  @IsString()
  picture!: string;

  @Field(() => Int)
  @IsInt()
  age!: number;

  @Field(() => Gender)
  @IsNotEmpty()
  gender!: Gender;
}
