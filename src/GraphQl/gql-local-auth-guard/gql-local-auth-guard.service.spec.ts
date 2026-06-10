import { Test, TestingModule } from '@nestjs/testing';
import { GqlLocalAuthGuardService } from './gql-local-auth-guard.service';

describe('GqlLocalAuthGuardService', () => {
  let service: GqlLocalAuthGuardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GqlLocalAuthGuardService],
    }).compile();

    service = module.get<GqlLocalAuthGuardService>(GqlLocalAuthGuardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
