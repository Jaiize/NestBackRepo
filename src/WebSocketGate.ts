import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user/user.service';
import { TokenService } from './token/token.service';
import { UseFilters } from '@nestjs/common';
import { WebSocketExceptFilter } from './WebSocketExceptFilter';

@UseFilters(WebSocketExceptFilter) // Still in progress
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGate implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  constructor(
    private readonly userServ: UserService,
    private tokenServ: TokenService,
  ) {}

  /*afterInit(server: any) {
    setInterval(() => {
      // this.server.emit('Connection', {
      //   Status: 'Still Connected',
      //   timestamp: new Date().toLocaleString('en_US', {
      //     hour: '2-digit',
      //     minute: '2-digit',
      //   }),
      // });
      return {
        Status: 'Ok',
        echo: 'Still Connected',
        timestamp: new Date().toLocaleString('en_US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    }, 1e10); // Reason: In progress
  }*/

  @SubscribeMessage('users')
  getUsers(@ConnectedSocket() client: Socket) {
    const users = this.userServ.findAll();
    // client.emit('received', { echo: "Users data" })
    return { clientId: client.id, echo: users };
  }

  @SubscribeMessage('user')
  getUser(@MessageBody() login: string, @ConnectedSocket() client: Socket) {
    const user = this.userServ.findOneWithQuery(login);
    // client.emit('received', { result: user })
    return { clientId: client.id, echo: user };
  }

  async handleConnection(client: Socket) {
    try {
      const authToken = client.handshake.auth.token as string;
      // const queryToken = client.handshake.query.token;
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
        };
        client.emit('Welcome', { Message: 'Connected to NestJs application' });
        return { Succces: 'Ok', echo: 'Connected to NestJs application' };
      }
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
  }
}

// Download @types for websockets
