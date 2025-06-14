import {
  Subject as CaslSubject,
  createMongoAbility,
  MongoAbility,
  MongoQuery,
  RawRuleOf,
} from '@casl/ability';
import { isEmpty } from 'lodash';
import {
  AccessPolicy,
  Effect,
} from 'src/access-policies/entities/access-policy.entity';
import * as Mustache from 'mustache';
import { Injectable } from '@nestjs/common';

export type Abilities<A extends string, S extends CaslSubject> = [A, S];
export type AppAbility<A extends string, S extends CaslSubject> = MongoAbility<
  Abilities<A, S>,
  MongoQuery
>;

@Injectable()
export class CaslAbilityFactory<A extends string, S extends CaslSubject> {
  constructor() {}

  async defineAbility(
    policies: AccessPolicy[],
    user: any,
  ): Promise<AppAbility<A, S>> {
    // Flatten all statements from policies
    const allStatements = policies.flatMap((policy) => policy.statements);
    const rules: RawRuleOf<AppAbility<A, S>>[] = [];

    // Process all statements
    allStatements.forEach((statement) => {
      const fields = !isEmpty(statement.fields) ? statement.fields : undefined;
      const conditions = !isEmpty(statement.conditions)
        ? this.replacePlaceholders(statement.conditions, user)
        : undefined;

      const rule = {
        action: statement.actions,
        subject: statement.resources,
        fields,
        conditions,
      } as RawRuleOf<AppAbility<A, S>>;

      // Place allow rules at the start and deny rules at the end
      if (statement.effect === Effect.Allow) {
        rules.unshift(rule);
      } else if (statement.effect === Effect.Deny) {
        rule.inverted = true;
        rules.push(rule);
      }
    });

    return createMongoAbility<AppAbility<A, S>>(rules);
  }

  /**
   * Recursively replace placeholders in the conditions object with values from the user object.
   * @param conditions - The conditions object with placeholders.
   * @param user - The user object containing values to replace placeholders from.
   * @returns The string with placeholders replaced.
   */
  private replacePlaceholders(conditions: any, user: any) {
    // Traverse the conditions object
    for (const key in conditions) {
      if (typeof conditions[key] === 'object' && conditions[key] !== null) {
        // Recursively replace placeholders in nested objects
        conditions[key] = this.replacePlaceholders(conditions[key], user);
      } else if (typeof conditions[key] === 'string') {
        // Replace the placeholder mustaches
        conditions[key] = Mustache.render(conditions[key], user);
      }
    }
    return conditions;
  }
}
