import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {

    const gqlctx = GqlArgumentsHost.create(host);
    const ctxtyp = gqlctx.getType<GqlContextType>();
    if (ctxtyp === 'graphql') {
      const message =
        exception instanceof UnauthorizedException
          ? 'Please sign in or Sign up!'
          : exception instanceof ForbiddenException
            ? "You Don't have the authorization to utilize this API"
            : (exception as { message: string }).message;

      return new GraphQLError(message);
    }

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message =
        exception.message === 'Forbidden resource'
          ? "You Don't have the authorization to utilize this API!"
          : exception.message === 'Unauthorized'
            ? 'Please sign in or Sign up!'
            : exception.message;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toLocaleString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: 'numeric',
      }),
      path: request.url,
    });
  }
}
