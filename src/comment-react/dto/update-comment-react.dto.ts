import { PartialType } from '@nestjs/swagger';
import { CreateCommentReactDto } from './create-comment-react.dto';

export class UpdateCommentReactDto extends PartialType(CreateCommentReactDto) {}
