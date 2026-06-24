import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfiguration {
  private secret!: string;
  private Refsecret!: string;

  constructor(private configService: ConfigService) {
    this.secret = this.configService.get('SECRET_KEY') as string;
    this.Refsecret = this.configService.get('REF_SECRET_KEY') as string;
  }

  get secretKey(): string {
    return this.secret;
  }

  get refSecretKey(): string {
    return this.Refsecret;
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
