import { Test, TestingModule } from '@nestjs/testing';
import { WhatToWhatService } from './what-to-what.service';

describe('WhatToWhatService', () => {
  let service: WhatToWhatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatToWhatService],
    }).compile();

    service = module.get<WhatToWhatService>(WhatToWhatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
