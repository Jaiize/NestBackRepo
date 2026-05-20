import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfiguration {
  private secret!: string;

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get('SECRET_KEY') as string;
  }

  get secretKey(): string {
    return this.secret;
  }

  get allEnv() {
    return process.env;
  }

  get path() {
    return process.cwd();
  }

  set setEnv({ key, value }: { key: string; value: string }) {
    this.configService.set(key, value);
  }

  // getEnv(key: string) {
  //   return this.configService.getOrThrow(key);
  // }
}
