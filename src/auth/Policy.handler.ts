import { ExecutionContext } from '@nestjs/common';
import { AppAbility } from './casl/casl-manage.factory/casl-manage.factory';

interface IPolicyHandler {
  handler(ability: AppAbility, ctx: ExecutionContext): boolean;
}

// type PolicyHandlerCallBack = (
//   ability: AppAbility,
//   ctx: ExecutionContext,
// ) => boolean;

// export type PolicyHandler = IPolicyHandler | PolicyHandlerCallBack;
export type PolicyHandler = IPolicyHandler;
