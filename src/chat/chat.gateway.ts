import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UseFilters } from '@nestjs/common';
import { WebSocketExceptFilter } from 'src/WebSocketExceptFilter';
import { Server, Socket } from 'socket.io';
import { WsUser } from 'src/WebSocketGate';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/user/entities/user.entity';

export interface JoinRoomPayload {
  roomId: string;
  user: User;
}

export interface MsgPayload {
  roomId: string;
  content: string;
  userId: string;
}

@UseFilters(new WebSocketExceptFilter()) // Still in progress
@WebSocketGateway({
  path: '/chat',
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway {
  @WebSocketServer() server!: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly userServ: UserService,
    private readonly tokenServ: TokenService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authToken =
        (client.handshake.auth.token as string) ||
        (client.handshake.query.token as string) ||
        (client.handshake.headers?.authorization as string);

      const [type, token] = authToken.split(' ') ?? [];
      const payload = this.tokenServ.verifyTokenForAuth(
        type === 'Bearer' ? token : '',
      ) as { user: string; iat: number };

      if (payload) {
        const user = await this.userServ.findOneInternally(payload.user);

        client.data = {
          id: user.id,
          username: user.username,
          email: user.email,
          canPost: user.canPost,
          isAdmin: user.isAdmin,
          socketId: client.id,
        };

        client.emit('welcome', {
          Message: 'Connected to Chat-socket endpoint',
          user: (client.data as WsUser).username,
        });
        return {
          echo: 'Connected to Chat-socket endpoint',
          user: (client.data as WsUser).username,
        };
      }
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
  }

  @SubscribeMessage('sendMsgToRoom')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = createChatDto;
    const messages = await this.chatService.create(createChatDto, client.id);
    this.server.to(roomId).emit('newmsg', [
      ...messages.map((m) => ({
        message: m.message,
        username: m.user.username,
        userId: m.user.id,
        created_at: new Date(m.created_at).toLocaleString('en-US', {
          month: 'short',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        edited:
          Number(new Date(m.created_at)) < Number(new Date(m.updated_at))
            ? true
            : false,
        roomId: roomId,
        clientId: client.id,
      })),
    ]);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const { roomId, user } = payload;

    await client.join(roomId);

    const fetchedUser = await this.chatService.joinRoom(payload);

    this.server.to(roomId).emit('newbie', {
      message: `${fetchedUser?.username} has joined the room ${roomId}`,
      userId: user.id,
      roomId,
      clientId: client.id,
    });

    return {
      message: `${user?.username} has joined the room ${roomId}`,
      userId: user.id,
      roomId,
      clientId: client.id,
    };
  }

  @SubscribeMessage('chats')
  async chatsForRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.findChatsForRoom(roomId);
    return [
      ...messages.map((m) => ({
        message: m.message,
        username: m.user.username,
        userId: m.user.id,
        created_at: new Date(m.created_at).toLocaleString('en-US', {
          month: 'short',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        edited:
          Number(new Date(m.created_at)) < Number(new Date(m.updated_at))
            ? true
            : false,
        roomId: roomId,
        clientId: client.id,
      })),
    ];
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() data: { roomId: string; userId: string }) {
    return this.chatService.findChatsForUser(data);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() { id }: { id: string }) {
    return this.chatService.remove(id);
  }
}
