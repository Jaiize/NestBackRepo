import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomConfiguration } from 'src/custom-config/custom.Config.Service';

@Module({
  imports: [ConfigModule],
  providers: [CustomConfiguration],
  exports: [CustomConfiguration],
})
export class CustomConfigModule {}
