import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  create({
    roomNumber,
    roomType,
    amenities,
    photos,
    price,
    checkinTime,
    checkoutTime,
    rating,
  }: CreateRoomDto): Promise<Room> {
    const room: Room = new Room();
    room.roomNumber = roomNumber;
    room.roomType = roomType;
    room.amenities = amenities;
    room.photos = photos;
    room.price = price;
    room.checkinTime = checkinTime;
    room.checkoutTime = checkoutTime;
    room.rating = rating;
    return this.roomRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    const rooms = await this.roomRepository.find();

    rooms.forEach((control) => {
      control.created_at = undefined!;
      control.updated_at = undefined!;
    });

    return rooms;
  }

  async findOne(id: number) {
    const result = await this.roomRepository.findOneBy({ id });
    if (result) {
      const obj = {
        ...result,
        created_at: undefined,
        updated_at: undefined,
      };
      return obj;
    } else {
      throw new NotFoundException(`Room no. ${id} not found!`);
    }
  }

  async update({
    roomNumber,
    roomType,
    photos,
    price,
    checkinTime,
    checkoutTime,
    rating,
    amenities,
  }: UpdateRoomDto): Promise<Room | undefined> {
    const exists = await this.roomRepository.findOne({
      where: { roomNumber: roomNumber },
    });
    if (exists) {
      exists.roomType = roomType!;
      exists.amenities = amenities!;
      exists.photos = photos!;
      exists.price = price!;
      exists.checkinTime = checkinTime!;
      exists.checkoutTime = checkoutTime!;
      exists.rating = rating!;
      return this.roomRepository.save(exists);
    } else {
      throw new NotFoundException(`Room no. ${roomNumber} not found!`);
    }
  }

  async remove(find: number): Promise<Room[] | undefined> {
    const exists = await this.roomRepository.findOne({ where: { id: find } });
    if (exists) {
      await this.roomRepository.remove(exists);
      const update = (await this.roomRepository.find()).filter(
        (strain) => strain.id != find,
      );
      return update;
    }
    throw new NotFoundException(`Room no. ${find} not found!`);
  }
}
