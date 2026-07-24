import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WebSocketExceptFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
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
