import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebSocketGate implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  handleDelete(itemId: number) {
    this.server.emit('deleteItem', itemId);
  }
}

// Download @types for websockets