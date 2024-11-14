import { Document } from '../Document.js';
import { Ref } from '../annotations/Ref.js';

/**
 * This function is used to test the type against value
 *
 * If type does not match, TS won't compile
 * Do noting in runtime
 */
export function testType<V>(): V {
  return {} as V;
}

export class TestSubDoc extends Document {
  info?: string;
}

export class TestPlan extends Document {
  price!: number;
  subDoc?: TestSubDoc[];
}

export class TestOrg extends Document {
  readonly _id!: string;

  name!: string;
  plan!: Ref<TestPlan>;
  plans!: Ref<TestPlan>[];

  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

export class TestUser extends Document {
  readonly _id!: string;

  name!: string;
  age!: number;
  org?: Ref<TestOrg>;
  orgs?: Ref<TestOrg>[];

  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}
