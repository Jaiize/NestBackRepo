import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Follow, UserService } from './user.service';
import { User } from './entities/user.entity';
import { PoliciesGuard } from 'src/auth/Policies.Guard';
import { CheckPolicies } from 'src/auth/Policy.check';
import { PolicyManage } from 'src/auth/casl/casl-manage.factory/Policy.manage';
import { ChangePass } from 'src/login.details';
import { Public } from 'src/auth/public.decorator';
import { Follower } from './entities/follower.entity';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Public()
  async toCreate(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const fetch = this.userService.register(createUserDto);
    await fetch.then((a) => {
      res.header('Authorization', `Bearer ${a?.token}`);
      res.json({ token: a?.token, user: a?.user });
    });
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PolicyManage())
  @Get()
  toFindAllUsers() {
    return this.userService.findAll();
  }

  @ApiProperty({ example: '4exgd-5f6r3-d8v3', description: 'UUID' })
  @Get('getOne/:uuid')
  toFindOneUuid(@Param('uuid') uuid: string) {
    return this.userService.findOneByUuid(uuid);
  }

  @Get(':info')
  toFindOneForOutput(@Param('info') info: string) {
    return this.userService.findOneWithQuery(info);
  }

  @Post('follow')
  async toFollowUser(@Body() follow: Follow): Promise<Follower> {
    return await this.userService.followUser(follow);
  }

  @Post('unfollow')
  async toUnfollowUser(@Body() follow: Follow, @Res() res: Response) {
    const result = await this.userService.unFollowUser(follow);
    return res.json(result);
  }

  @Get('pull/followers/:id')
  async toGetFollowers(@Param('id') userId: string): Promise<User[]> {
    return this.userService.getFollowers(userId);
  }

  @Get('pull/following/:id')
  async toGetFollowing(@Param('id') userId: string): Promise<User[]> {
    return this.userService.getFollowing(userId);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PolicyManage())
  @Patch()
  toUpdate(@Body() find: User) {
    return this.userService.update(find);
  }

  /**
   * Remember that this route is not protected by any guard, and needs strict client-filtering
   * services or checkings before accessing.
   * @param change : object type of {email: string, password: string}
   * @returns : a string meassage "Successfully changed"
   */
  @Public()
  @Patch('auth/password/alt')
  toUpdatePass(@Body() change: ChangePass) {
    return this.userService.updatePass(change);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PolicyManage())
  @Delete()
  toRemove(@Body() email: string) {
    return this.userService.remove(email);
  }
}
