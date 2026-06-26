import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnv } from './config/config.config';

@Injectable()
export class CustomConfiguration {
  constructor(private configService: ConfigService) {}

  get secretKey() {
    return this.configService.get<ConfigEnv['secret']>('secret');
  }

  get refSecretKey() {
    return this.configService.get<ConfigEnv['refsecret']>('refsecret');
  }

  get dataName() {
    return this.configService.get<ConfigEnv['database']['name']>(
      'database.name',
    );
  }

  get dataPort() {
    return this.configService.get<ConfigEnv['database']['port']>(
      'database.port',
    );
  }

  get dataUser() {
    return this.configService.get<ConfigEnv['database']['username']>(
      'database.username',
    );
  }

  get dataPass() {
    return this.configService.get<ConfigEnv['database']['password']>(
      'database.password',
    );
  }

  get dataHost() {
    return this.configService.get<ConfigEnv['database']['host']>(
      'database.host',
    );
  }

  get salt() {
    return this.configService.get<ConfigEnv['salt']>('salt');
  }

  get allEnv() {
    return process.env;
  }

  get path() {
    return process.cwd();
  }

  set set({ key, value }: { key: string; value: string }) {
    this.configService.set(key, value);
  }

  // getEnv(key: string) {
  //   return this.configService.getOrThrow(key);
  // }
}
