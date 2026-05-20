import { Test, TestingModule } from '@nestjs/testing';
import { CommentReactService } from './comment-react.service';

describe('CommentReactService', () => {
  let service: CommentReactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentReactService],
    }).compile();

    service = module.get<CommentReactService>(CommentReactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
