import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'The room Number', type: 'string' })
  @IsString()
  @IsNotEmpty()
  roomNumber!: string;

  @ApiProperty({
    type: 'string',
    description: 'Type of room quality from standard to Luxury',
    example: 'Deluxe or Suit',
  })
  @IsNotEmpty()
  roomType!: string;

  @ApiProperty({
    description: 'The Equipments to the room and amenities',
    type: 'string',
    example: 'Wi Fi, Bathtub',
  })
  @IsNotEmpty()
  amenities!: string;

  @ApiProperty({
    description: 'The room Photos: array of string',
    type: 'array',
  })
  @IsNotEmpty()
  photos!: string[];

  @ApiProperty({ description: 'The room price', type: 'number' })
  @IsInt()
  @IsNotEmpty()
  price!: number;

  @ApiProperty({ description: 'Check-in date', type: 'string' })
  @IsDate()
  @IsNotEmpty()
  checkinTime!: Date;

  @ApiProperty({ description: 'Check-out date', type: 'string' })
  @IsNotEmpty()
  checkoutTime!: Date;

  @ApiProperty({ description: 'Room rating', type: 'number' })
  @IsInt()
  @IsNotEmpty()
  rating!: number;

  @ApiProperty({ description: 'Date created', type: 'string' })
  @IsString()
  @IsNotEmpty()
  created_at!: Date;

  @ApiProperty({ description: 'Date updated', type: 'string' })
  @IsNotEmpty()
  updated_at!: Date;
}
