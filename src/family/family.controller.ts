import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { Family } from './entities/family.entity';
import { DeleteResult } from 'typeorm';

@Controller('api/family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Post()
  toCreate(@Body() createFamilyDto: CreateFamilyDto): Promise<Family> {
    return this.familyService.create(createFamilyDto);
  }

  @Get(['', ''])
  toFindAll(): Promise<Family[]> {
    return this.familyService.findAll();
  }

  @Get(':id')
  toFindOne(@Param('id') id: string) {
    return this.familyService.findOne(id);
  }

  @Patch(':id')
  toUpdate(
    @Param('id') id: string,
    @Body() find: Family,
  ): Promise<Family | undefined> {
    return this.familyService.update(find, id);
  }

  @Delete(':id')
  toRemove(@Param('id') id: string): Promise<DeleteResult> {
    return this.familyService.remove(+id);
  }
}
