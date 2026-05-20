import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomNumber!: string;

  @ApiProperty()
  @IsNotEmpty()
  roomType!: string;

  @ApiProperty()
  @IsNotEmpty()
  amenities!: string;

  @ApiProperty()
  @IsNotEmpty()
  photos!: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  price!: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  checkinTime!: Date;

  @ApiProperty()
  @IsNotEmpty()
  checkoutTime!: Date;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  rating!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  created_at!: Date;

  @ApiProperty()
  @IsNotEmpty()
  updated_at!: Date;
}
