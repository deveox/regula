import { describe, expect, test } from 'tstyche';
import { Populated } from './Populate.js';
import { TestOrg, TestUser } from './utils.test.js';

describe('Populated', () => {
  test('simple', () => {
    expect<Populated<TestUser, 'org'>>().type.toBe<
      TestUser & {
        org: TestOrg | null;
      }
    >();
    expect<Populated<TestUser, 'org'>>().type.toBeAssignableTo<TestUser>();
    expect<Populated<TestUser, 'org'>['org']>().type.toBeAssignableTo<TestOrg>();
    expect<Populated<TestUser, 'orgs'>>().type.toBe<
      TestUser & {
        orgs: TestOrg[];
      }
    >();
    expect<Populated<TestUser, 'orgs'>>().type.toBeAssignableTo<TestUser>();
    expect<Populated<TestUser, 'orgs'>['orgs']>().type.toBeAssignableTo<TestOrg[]>();
    expect<Populated<TestUser, 'org' | 'orgs'>>().type.toBe<
      TestUser & {
        org: TestOrg | null;
        orgs: TestOrg[];
      }
    >();
  });
});
