import { Module } from '@nestjs/common';
import { CaslManageFactory } from './casl-manage.factory';

@Module({
  providers: [CaslManageFactory],
  exports: [CaslManageFactory],
})
export class CaslModule {}
