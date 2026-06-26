import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { RoomsModule } from './rooms/rooms.module';
import { FamilyModule } from './family/family.module';
import { TokenModule } from './token/token.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt-strategy/jwt.auth.guard';
import { CustomConfiguration } from './custom.Config.Service';
import { FileModule } from './file/file.module';
import { Follower } from './user/entities/follower.entity';
// import { TypeormConfig } from './login.details';
import { CommentModule } from './comment/comment.module';
import { CommentReactModule } from './comment-react/comment-react.module';
import { UserGqlModule } from './GraphQl/user-gql/user-gql.module';
import { TokenService } from './token/token.service';
import { UserService } from './user/user.service';
import { WhatToWhatService } from './what-to-what/what-to-what.service';
import { CustomConfigModule } from './custom-config/custom-config.module';
import configuration from './config/config.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [configuration]
    }),
    // TypeOrmModule.forRoot(TypeormConfig),
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfiguration],
      useFactory: (config: CustomConfiguration) => ({
        type: 'postgres',
        host: config.dataHost,
        database: config.dataName,
        port: config.dataPort,
        username: config.dataUser,
        password: config.dataPass,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      })
    }),
    UserModule,
    AuthModule,
    RoomsModule,
    FamilyModule,
    TokenModule,
    FileModule,
    CommentModule,
    CommentReactModule,
    UserGqlModule,
    CustomConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TokenService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    WhatToWhatService,
  ],
})
export class AppModule {}
