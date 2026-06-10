import {
  ArgumentsHost,
  Catch,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQlErroFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const message =
      exception instanceof UnauthorizedException
        ? 'Please sign in or Sign up!'
        : exception instanceof ForbiddenException
          ? "You Don't have the authorization to utilize this API"
          : (exception as { message: string }).message;

    return new GraphQLError(message);
  }
}
