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
    inst: ClassConstructor<R>,
    plain: I,
    options?: ClassTransformOptions,
  ) {
    return plainToInstance(inst, plain, options);
  }

  plainArrayToInstance<R, I>(
    inst: ClassConstructor<R>,
    plain: I[],
    options?: ClassTransformOptions,
  ) {
    return plainToInstance(inst, plain, options);
  }
}
