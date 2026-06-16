import { Injectable } from '@nestjs/common';
import {
  ClassConstructor,
  plainToClass,
  plainToInstance,
} from 'class-transformer';

@Injectable()
export class WhatToWhatService {
  plainToClass(cls: ClassConstructor<object>, plain: object) {
    return plainToClass(cls, plain);
  }

  plainToInstance(cls: ClassConstructor<object>, plain: object) {
    return plainToInstance(cls, plain);
  }
}
