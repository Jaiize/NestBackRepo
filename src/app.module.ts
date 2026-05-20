import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { RoomsModule } from './rooms/rooms.module';
import { Room } from './rooms/entities/room.entity';
import { FamilyModule } from './family/family.module';
import { Family } from './family/entities/family.entity';
import { TokenModule } from './token/token.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt-strategy/jwt.auth.guard';
import { CustomConfiguration } from './custom.Config.Service';
import { FileModule } from './file/file.module';
import { FileEntity } from './file/entities/file.entity';
import { S3Client } from '@aws-sdk/client-s3';
import { Follower } from './user/entities/follower.entity';
// import { TypeormConfig } from './login.details';
import { CommentModule } from './comment/comment.module';
import { CommentUser } from './comment/entities/comment.user.entity';
import { CommentReactModule } from './comment-react/comment-react.module';
import { CommentReact } from './comment-react/entities/comment-react.entity';
import { PostReact } from './comment-react/entities/post-react.entity';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeOrmModule.forRoot(TypeormConfig),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: process.env.db_database,
      port: parseInt(process.env.db_port!),
      username: process.env.db_user,
      password: process.env.db_code,
      entities: [
        User,
        Room,
        Family,
        FileEntity,
        Follower,
        CommentUser,
        CommentReact,
        PostReact,
      ],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    RoomsModule,
    FamilyModule,
    TokenModule,
    FileModule,
    CommentModule,
    CommentReactModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CustomConfiguration,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          region: 'my_region_here',
          credentials: {
            accessKeyId: 'My_accessKeyId_here',
            secretAccessKey: 'My_secretAccessKey_here',
          },
        });
      },
    },
  ],
  exports: [CustomConfiguration],
})
export class AppModule {}

// C:\Program Files\PostgreSQL\16\scripts>
