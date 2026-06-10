import { Test, TestingModule } from '@nestjs/testing';
import { GqlLocalStrategyService } from './gql-local-strategy.service';

describe('GqlLocalStrategyService', () => {
  let service: GqlLocalStrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GqlLocalStrategyService],
    }).compile();

    service = module.get<GqlLocalStrategyService>(GqlLocalStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
