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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketGate
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server!: Server;

  constructor(
    private readonly userServ: UserService,
    private tokenServ: TokenService,
  ) {}

  afterInit(server: any) {
    setInterval(() => {
      // this.server.emit('Connection', {
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
    }, 5000);
  }

  @SubscribeMessage('users')
  getUsers(@ConnectedSocket() client: Socket) {
    // client.emit('received', { echo: "Users data" })
    const users = this.userServ.findAll();
    return { clientId: client.id, echo: users };
  }

  @SubscribeMessage('user')
  getUser(@MessageBody() login: string, @ConnectedSocket() client: Socket) {
    // client.emit('received', { result: user })
    const user = this.userServ.findOneWithQuery(login);
    return { clientId: client.id, echo: user };
  }

  handleConnection(client: Socket) {
    const authToken = client.handshake.auth.token as string;
    // const queryToken = client.handshake.query.token;
    const [type, token] = authToken.split(' ') ?? [];
    const payload = this.tokenServ.verifyTokenForAuth(
      type === 'Bearer' ? token : '',
    );
    if (payload) {
      client.emit('Welcome', { Message: 'Connected to NestJs application' });
      return { Succces: 'Ok', echo: 'Connected to NestJs application' };
    } else {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    client.disconnect();
  }
}

// Download @types for websockets
