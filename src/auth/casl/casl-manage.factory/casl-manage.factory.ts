import {
  MongoAbility,
  InferSubjects,
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action, Article } from 'src/auth/Action';
import { User } from 'src/user/entities/user.entity';

type Subjects = InferSubjects<typeof Article | typeof User> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslManageFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.isAdmin) {
      // manage in CASL means 'any' or 'all' so is 'all'
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
      can(Action.Create, User, { canPost: true });
      can(Action.Update, User, { email: user.email });
      can(Action.Update, Article, { authorId: user.id });
      // Because not tested yet!
      cannot(Action.Delete, Article, { isPublished: true }).because(
        'Published articles can not be deleted!',
      );
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

// One of the complex syntaxes
/*
(alias) type InferSubjects<T, IncludeTagName extends boolean = false> = T | 
  (T extends AnyClass<infer I> ? I | 
    (IncludeTagName extends true ? 
      T extends SubjectClassWithCustomName<infer Name> ? Name 
      : TagName<I> 
    : never) 
  : TagName<T>)
*/
