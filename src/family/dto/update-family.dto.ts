import { CreateFamilyDto } from './create-family.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFamilyDto extends PartialType(CreateFamilyDto) {}
