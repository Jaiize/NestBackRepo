import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/GraphQl/user-gql/UserObj';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: "User's name",
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(9, { message: 'Name cannot be less than nine characters!' })
  name!: string;

  @ApiProperty({
    type: 'string',
    example: 'john_doe',
    description: "User's username or nickname",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Username must have atleast three characters!' })
  @IsAlphanumeric('en-US', {
    message: 'Username must be alphaNumeric characters!',
  })
  username!: string;

  @ApiProperty({ type: 'number', description: "User's age" })
  @IsInt()
  age!: number;

  @ApiProperty({
    example: 'John@example.com',
    description: "User's email address",
    type: 'string',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: "Email field can't be empty" })
  email!: string;

  @ApiProperty({ description: "User's gender" })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender!: Gender;

  @IsString()
  @IsNotEmpty()
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
}
