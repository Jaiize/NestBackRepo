import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user/user.service';
import { TokenService } from './token/token.service';
import { UseFilters } from '@nestjs/common';
import { WebSocketExceptFilter } from './WebSocketExceptFilter';

export interface WsUser {
  id: string;
  socketId: string;
  email: string;
  username: string;
  canPost: boolean;
  isAdmin: boolean;
}

@UseFilters(new WebSocketExceptFilter()) // Still in progress
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class WebSocketGate implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  constructor(
    private readonly userServ: UserService,
    private tokenServ: TokenService,
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
          Message: 'Connected to Hotel-enventory application',
          user: (client.data as WsUser).username,
        });
        return {
          echo: 'Connected to Hotel-enventory application',
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
  async getUsers(@ConnectedSocket() client: Socket) {
    if (!(client.data as WsUser).isAdmin) {
      client.emit('fetch_error', {
        message: "You don't have access to this event!",
      });
      // throw new WsException("You don't have access to this event!")
      return {
        clientId: client.id,
        message: "You don't have access to this event!",
      };
    }
    const users = await this.userServ.findAll();

    client.emit('receive_all', { echo: users });
    return { clientId: client.id, echo: users };
  }

  @SubscribeMessage('user')
  async getUser(
    @MessageBody() { login }: { login: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.userServ.findOneWithQuery(login);
    if (!user) {
      client.emit('not_found', { message: 'user not found' });
      return { message: 'user not found' };
    }
    client.emit('receive', { result: user });
    return { clientId: client.id, echo: user };
  }

}
