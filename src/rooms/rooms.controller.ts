import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  SetMetadata,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';
import { Response, Request } from 'express';
import { WebSocketGate } from 'src/WebSocketGate';
import { PoliciesGuard } from 'src/auth/Policies.Guard';
import { CheckPolicies } from 'src/auth/Policy.check';

import { PolicyUpdate } from 'src/auth/casl/casl-manage.factory/Policy.upate';
import { PolicyCreate } from 'src/auth/casl/casl-manage.factory/Policy.create';
import { PolicyDelete } from 'src/auth/casl/casl-manage.factory/PolicyDelete';
import { Action, Article } from 'src/auth/Action';
import { Public } from 'src/auth/public.decorator';
// import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// @ApiTags('api/rooms')
@Controller('api/rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly webSocket: WebSocketGate,
  ) {}

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PolicyCreate())
  @Post()
  async toCreate(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.roomsService.create(createRoomDto);
  }

  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: '2XX', description: 'Rooms retrieved successfully' })
  @ApiResponse({ status: '4XX', description: 'Forbidden' })
  // @Public()
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(new PolicyCreate())
  @Get()
  async toFindAll(): Promise<Room[]> {
    return await this.roomsService.findAll();
  }

  @Get(':id')
  async toFindOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const rooms = await this.roomsService.findOne(id);

    // How to fetch query params from req
    // const q = req.query['id']
    // const rooms = await this.roomsService.findOne(+(q as string));

    // How to set cookie
    // res.cookie('cookie_name', 'Token_for_testing_purposes_only', {
    //   httpOnly: false,
    //   expires: new Date(Date.now() + 86400000), // expires in 1 day
    // });

    return res.json(rooms);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PolicyUpdate())
  @Patch()
  async toUpdate(@Body() find: Room): Promise<Room | undefined> {
    return await this.roomsService.update(find);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PolicyDelete(), {
    handler(ability, ctx) {
      return ability.can(Action.Manage, Article);
    },
  })
  @Delete(':id')
  async toRemove(@Param('id') id: number): Promise<Room[] | undefined> {
    const result = await this.roomsService.remove(id);
    this.webSocket.handleDelete(id);
    return result;
  }
}
// Let's work on slug

// Still in progress
// export const UserInf = () => SetMetadata('isUser', User)
