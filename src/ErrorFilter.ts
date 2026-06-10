import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
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
