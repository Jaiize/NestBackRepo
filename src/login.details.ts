// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { Family } from './family/entities/family.entity';
// import { FileEntity } from './file/entities/file.entity';
// import { Room } from './rooms/entities/room.entity';
// import { User } from './user/entities/user.entity';

export interface SignIn {
  login: string;
  password: string;
}

export interface ChangePass {
  email: string;
  password: string;
}
// in progress to replace the TypeOrmModule.forRoot({<>})
// export const TypeormConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: 'localhost',
//   database: process.env.db_database,
//   port: parseInt(process.env.db_port!),
//   username: process.env.db_user,
//   password: process.env.db_code,
//   entities: [User, Room, Family, FileEntity],
//   synchronize: true,
//   logging: true,
// };
