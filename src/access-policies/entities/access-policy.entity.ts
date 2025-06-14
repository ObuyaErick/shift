export enum Effect {
  Allow = 'Allow',
  Deny = 'Deny',
}

export class Statement {
  effect: Effect;
  actions: ('all' | 'create' | 'read' | 'update' | 'delete')[];
  resources: string[];
  fields: string[];
  conditions: any;
}

export class AccessPolicy {
  version: string;
  statements: Statement[];
}
