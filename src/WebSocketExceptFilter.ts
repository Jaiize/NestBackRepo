import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class WebSocketExceptFilter implements WsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    return {
      event: 'error',
      data: {
        message:
          exception instanceof WsException
            ? exception.message
            : 'Internal Server Error',
        code:
          exception instanceof WsException
            ? exception.getError()
            : 'Something went wrong',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
