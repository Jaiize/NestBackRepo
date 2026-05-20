import { PolicyHandler } from './Policy.handler';
import { SetMetadata } from '@nestjs/common';

export const policyDoor = 'check_policies'

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(policyDoor, handlers);
