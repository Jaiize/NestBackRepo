import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>,
  ) {}

  create(createFamilyDto: CreateFamilyDto): Promise<Family> {
    const family: Family = new Family();
    family.brothers = createFamilyDto.brothers;
    family.mother = createFamilyDto.mother;
    family.sisters = createFamilyDto.sisters;
    family.children = createFamilyDto.children;
    family.user = createFamilyDto.user;
    return this.familyRepository.save(family);
  }

  async findAll(): Promise<Family[]> {
    const all = await this.familyRepository.find();

    all.forEach((control) => {
      control.created_at = undefined!;
      control.updated_at = undefined!;
    });

    return all;
  }

  async findOne(id: string) {
    const result = await this.familyRepository.findOneBy({
      ownerId: id,
    });
    if (result) {
      // const obj = {
      //   ...result,
      //   created_at: undefined,
      //   updated_at: undefined,
      // };
      return result;
    } else {
      throw new NotFoundException('Details not found!');
    }
  }

  async update(
    { brothers, mother, sisters, children }: UpdateFamilyDto,
    id: string,
  ): Promise<Family | undefined> {
    const exists = await this.familyRepository.findOne({
      where: { ownerId: id },
    });
    if (exists) {
      exists.brothers = [...exists.brothers, ...brothers!];
      exists.mother = mother!;
      exists.sisters = [...exists.sisters, ...sisters!];
      exists.children = [...exists.children, ...children!];

      // brothers!.forEach((t) => {
      //   exists.brothers.push(t);
      // });

      // sisters!.forEach((t) => {
      //   exists.sisters.push(t);
      // });

      // children!.forEach((t) => {
      //   exists.children.push(t);
      // });

      return this.familyRepository.save(exists);
    } else {
      throw new NotFoundException('Wrong id: Details not found');
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    const fam = await this.familyRepository.delete(id);
    if (fam) return fam;
    throw new NotFoundException('Wrong id: Details not found');
  }
}
