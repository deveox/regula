import { describe, expect, test } from 'tstyche';
import type { Ref } from './Ref.js';

describe('Ref', () => {
  class Org extends Document {
    name!: string;
  }

  class User extends Document {
    name!: string;
    age!: number;
    org!: Ref<Org>;
    orgs!: Ref<Org>[];
  }
  test('In', () => {
    expect<Ref.In<User['name']>>().type.toBe<false>();
    expect<Ref.In<User['org']>>().type.toBe<boolean>();
    expect<Ref.In<User['orgs']>>().type.toBe<boolean>();
  });
  test('Keys', () => {
    expect<Ref.Keys<User>>().type.toBe<'org' | 'orgs'>();
  });
  test('Populated', () => {
    expect<Ref.Populated<Ref<Org>>>().type.toBe<Org | null>();
    expect<Ref.Populated<Ref<Org>[]>>().type.toBe<Org[]>();
  });
  test('PopulatedSignature', () => {
    expect<Ref.PopulatedSignature<Ref<Org>>>().type.toBe<Org>();
    expect<Ref.PopulatedSignature<Ref<Org>[]>>().type.toBe<Org>();
  });
});
