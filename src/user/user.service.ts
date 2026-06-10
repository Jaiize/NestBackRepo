import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { ChangePass } from 'src/login.details';
import { Follower } from './entities/follower.entity';
import { TokenService } from 'src/token/token.service';

export interface Follow {
  followerId: string;
  followingId: string;
}

@Injectable()
export class UserService {
  private salt = process.env.SALT;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    private readonly tokenServ: TokenService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const backUser = await this.checkOneForReg(
      createUserDto.username,
      createUserDto.email,
    );
    if (!backUser) {
      const hash_password: string = await bcrypt.hash(
        createUserDto.password,
        parseInt(this.salt!),
      );
      const new_user = {
        ...createUserDto,
        password: hash_password,
      };
      const new_user_stored = await this.userRepository.save(new_user);
      const token = this.tokenServ.generateToken({
        login: new_user_stored.email,
        password: '',
      });
      const user: User = new User();
      user.name = createUserDto.name;
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      user.gender = createUserDto.gender;
      user.age = createUserDto.age;
      user.password = createUserDto.password;
      const strained_user = {
        ...new_user_stored,
        password: undefined,
      };
      return { token: token, user: strained_user };
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: [
        'age',
        'canPost',
        'created_at',
        'email',
        'gender',
        'id',
        'isAdmin',
        'name',
        'updated_at',
        'username',
      ],
    });

    // users.forEach((control) => {
    //   control.created_at = undefined!;
    //   control.updated_at = undefined!;
    //   control.password = undefined!;
    //   // control.age = undefined!;
    // });

    return users;
  }

  async findOneInternally(login: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: login })
      .orWhere('user.email = :email', { email: login })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async findOneByUuid(uuid: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :uuid', { uuid: uuid })
      .select([
        'user.id',
        'user.username',
        'user.name',
        'user.created_at',
        'user.updated_at',
        'user.email',
        'user.age',
        'user.gender',
        'user.isAdmin',
        'user.canPost',
      ])
      .getOne();

    if (!user) {
      throw new NotFoundException('user not found!');
    }
    return user;
  }

  async findOneWithQuery(login: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: login })
      .orWhere('user.email = :email', { email: login })
      .orWhere('user.name = :name', { name: login })
      .select([
        'user.id',
        'user.username',
        'user.name',
        'user.created_at',
        'user.updated_at',
        'user.email',
        'user.age',
        'user.gender',
        'user.isAdmin',
        'user.canPost',
      ])
      .getOne();

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    return user;
    // const { id: idt, isAdmin: admin, name: per } = user
    // const userData = { idt, admin, per }
    // return userData
  }

  async followUser({ followerId, followingId }: Follow): Promise<Follower> {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself!');
    }

    const exists = await this.followerRepository.findOne({
      where: { followerId, followingId },
    });

    if (exists) {
      throw new BadRequestException('Already following!');
    }

    const result = this.followerRepository.create({
      followerId,
      followingId,
    });

    return await this.followerRepository.save(result);
  }

  async unFollowUser({ followerId, followingId }: Follow): Promise<string> {
    const isDeleted = await this.followerRepository.delete({
      followerId,
      followingId,
    });

    if (isDeleted.affected === 0) {
      throw new BadRequestException('Not such relation found between users!');
    }
    return 'User unfollowed successfully!';
  }

  async checkOneForReg(username: string, email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ email: email }, { username: username }],
    });
    if (user) {
      if (user.email === email) {
        throw new BadRequestException('Email already exists!');
      } else if (user.username === username) {
        throw new BadRequestException('Username already exists!');
      }
    }
    return null;
  }

  async getFollowers(userId: string, fetch?: number): Promise<User[]> {
    const user = await this.followerRepository.find({
      where: { followingId: userId },
      relations: ['followerUser'],
      take: fetch,
    });
    return user.map((e) => e.followerUser);
  }

  async getFollowing(userId: string, fetch?: number): Promise<User[]> {
    const user = await this.followerRepository.find({
      where: { followerId: userId },
      relations: ['followingUser'],
      take: fetch,
    });
    return user.map((e) => e.followingUser);
  }

  async update({
    name,
    age,
    gender,
    email,
    username,
  }: UpdateUserDto): Promise<undefined | string> {
    const exists = await this.userRepository.findOne({
      where: { email: email },
    });
    if (exists) {
      exists.name = name!;
      exists.age = age!;
      exists.gender = gender!;
      exists.username = username!;

      await this.userRepository.save(exists);
      return 'Successfully Updated!';
    } else {
      return undefined;
    }
  }

  /**
   * Confirmation of the client's data or their existence must be done first
   * before using this route for new password change
   **/
  async updatePass({
    email,
    password,
  }: ChangePass): Promise<string | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      const new_pass: string = await bcrypt.hash(password, this.salt!);
      user.password = new_pass;
      await this.userRepository.save(user);
      return 'Successfully changed!';
    }
    throw new NotFoundException('user not found!');
  }

  async remove(email: string): Promise<User | undefined> {
    const exists = await this.userRepository.findOne({
      where: { email: email },
    });
    if (exists) {
      return this.userRepository.remove(exists);
    }
  }
}

// const user = this.userRepository
//   .createQueryBuilder('user')
//   .leftJoinAndSelect('user.followers', 'followers')
//   .leftJoinAndSelect('user.following', 'following')
//   .where('user.username = :username', { username: login })
//   .execute();
// Weird keys though

// Correct query display with relation joined
// const user = await this.userRepository
//   .createQueryBuilder('user')
//   .leftJoinAndSelect('user.followers', 'followers') // alias work only when .execute() is used (followers is alias)
//   .leftJoinAndSelect('user.following', 'following') // Same as above
//   .leftJoinAndSelect('user.family', 'f3')
//   .loadRelationCountAndMap('user.followersCount', 'user.followers')
//   .loadRelationCountAndMap('user.followingCount', 'user.following')
//   .where('user.username = :username', { username: login })
//   .getOne();
