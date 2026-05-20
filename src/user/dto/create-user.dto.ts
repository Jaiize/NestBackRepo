import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8, 20}$/;

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(9, { message: 'Name cannot be less than nine characters!' })
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast three characters!' })
  @IsAlphanumeric('en-US', {
    message: 'Username does not allow other than alpha numeric chars!',
  })
  username!: string;

  @ApiProperty()
  @IsInt()
  age!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "Email field can't be empty" })
  @IsEmail(
    { allow_display_name: false },
    { message: 'Please provide a valid email!' },
  )
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['m', 'f', 'u'])
  gender!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain minimum of 8 characters and maxumum of 20 characters,
    at least one uppercase letter, one lowercase letter, one number and one special character!`,
  })
  password!: string;

  @ApiProperty()
  @IsNotEmpty()
  created_at!: Date;

  @ApiProperty()
  @IsNotEmpty()
  updated_at!: Date;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isAdmin!: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  canPost!: boolean;
}
