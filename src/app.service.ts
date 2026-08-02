import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMessage(): string {
    return 'Hello World! this is a Hotel-inventory Backend App';
  }
}
