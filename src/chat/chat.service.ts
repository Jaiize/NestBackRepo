import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { DataSource } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { JoinRoomPayload } from './chat.gateway';
import { User } from 'src/user/entities/user.entity';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(private readonly data: DataSource) {}
  async create(
    { message, roomId, user }: CreateChatDto,
    clientId: string,
  ): Promise<Chat[]> {
    const chat = new Chat();
    chat.message = message;
    chat.clientId = clientId;
    chat.roomId = roomId;
    chat.user = user;

    await this.data.manager.save(Chat, chat);
    return await this.findChatsForRoom(roomId);
  }

  async joinRoom({ user }: JoinRoomPayload): Promise<User | null> {
    return await this.data.manager.findOne(User, { where: { id: user.id } });
  }

  async findChatsForRoom(roomId: string): Promise<Chat[]> {
    return await this.data.manager.find(Chat, {
      where: { roomId },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
  }

  async findChatsForUser({
    roomId,
    userId,
  }: {
    roomId: string;
    userId: string;
  }): Promise<Chat[]> {
    return await this.data.manager.find(Chat, {
      where: { roomId, userId },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
  }

  async update(
    id: string,
    { message, roomId, user }: UpdateChatDto,
  ): Promise<Chat | WsException> {
    const chat = await this.data.manager.findOne(Chat, {
      where: { roomId, userId: user?.id, id },
    });
    if (chat) {
      chat.message = message!;
      return await this.data.manager.save(Chat, chat);
    }
    return new WsException('No such chat found');
  }

  async remove(id: string) {
    const chat = await this.data.manager.findOne(Chat, {
      where: { id },
    });
    if (chat) {
      await this.data.manager.remove(Chat, chat);
    }
  }
}
