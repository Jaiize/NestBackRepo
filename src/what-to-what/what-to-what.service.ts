import { Injectable } from '@nestjs/common';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
  plainToInstance,
} from 'class-transformer';

@Injectable()
export class WhatToWhatService {
  plainToClass<R, I>(
    cls: ClassConstructor<R>,
    plain: I,
    options?: ClassTransformOptions,
  ) {
    return plainToClass(cls, plain, options);
  }

  plainToInstance<R, I>(
    cls: ClassConstructor<R>,
    plain: I,
    options?: ClassTransformOptions,
  ) {
    return plainToInstance(cls, plain, options);
  }

  plainArrayToInstance<R, I>(
    cls: ClassConstructor<R>,
    plain: I[],
    options?: ClassTransformOptions,
  ) {
    return plainToInstance(cls, plain, options);
  }
}
