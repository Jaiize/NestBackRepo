import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { UserGqlService } from './user-gql.service';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { Follower } from 'src/user/entities/follower.entity';
import { AuthService } from 'src/auth/auth.service';
import { TokenService } from 'src/token/token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Follower]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      context: ({ req, res }: { req: Request; res: Response }) => {
        return { req, res };
      },
      formatError: (error) => {
        const time = new Date().toLocaleString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: 'numeric',
        });

        return {
          message: error.message,
          code: error.extensions?.code,
          timestamp: time
        };
      },
    }),
  ],
  providers: [UserGqlService, UserService, AuthService, TokenService],
})
export class UserGqlModule {}
