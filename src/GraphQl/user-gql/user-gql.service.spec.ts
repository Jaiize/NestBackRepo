import { Test, TestingModule } from '@nestjs/testing';
import { UserGqlService } from './user-gql.service';

describe('UserGqlService', () => {
  let service: UserGqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGqlService],
    }).compile();

    service = module.get<UserGqlService>(UserGqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
