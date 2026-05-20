import { Test, TestingModule } from '@nestjs/testing';
import { CommentReactController } from './comment-react.controller';
import { CommentReactService } from './comment-react.service';

describe('CommentReactController', () => {
  let controller: CommentReactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentReactController],
      providers: [CommentReactService],
    }).compile();

    controller = module.get<CommentReactController>(CommentReactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
