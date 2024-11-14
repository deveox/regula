import { describe, expect, test } from 'tstyche';
import { Default } from '../annotations/Default.js';
import { MongoId } from '../annotations/MongoId.js';
import { Ref } from '../annotations/Ref.js';
import { Flatten } from './Flatten.js';
import { TestUser } from './utils.test.js';

describe('Flatten', () => {
  interface C {
    id?: string;
  }
  interface B {
    age: number;
    c?: C;
  }
  interface A {
    name: string;
    b: B;
  }
  test('paths', () => {
    const _: Flatten.Keys<A> = '' as 'name' | 'b' | 'b.age' | 'b.c' | 'b.c.id';
    expect<Flatten.Keys<A>>().type.toBe<'name' | 'b' | 'b.age' | 'b.c' | 'b.c.id'>();
  });
  test('simple', () => {
    type FlattenA = Flatten<A>;
    expect<FlattenA>().type.toMatch<{ name: string }>();
    expect<FlattenA>().type.toMatch<{ b: B }>();
    expect<FlattenA>().type.toMatch<{ 'b.age': number }>();
    expect<FlattenA>().type.toMatch<{ 'b.c'?: C }>();
    expect<FlattenA>().type.toMatch<{ 'b.c.id'?: string }>();
  });
  test('with arrays', () => {
    // arrays should not be flattened
    interface A {
      name: string;
      b: { age: number }[];
    }
    type FlattenA = Flatten<A>;
    expect<FlattenA>().type.toBe<{ name: string; b: { age: number }[] }>();
  });
  test('with any', () => {
    interface A {
      name: string;
      b: any;
    }
    type FlattenA = Flatten<A>;
    expect<FlattenA>().type.toBe<{ name: string; b: any }>();
  });
  test('with index signature', () => {
    interface A {
      name: string;
      b: { [key: string]: number };
    }
    type FlattenA = Flatten<A>;
    expect<FlattenA>().type.toBe<{ name: string; b: { [key: string]: number } }>();
    interface B {
      name: string;
      nested: Record<string, A>;
    }
    type FlattenB = Flatten<B>;
    expect<FlattenB>().type.toBe<{ name: string; nested: Record<string, A> }>();
  });
  test('with built-in types', () => {
    interface B {
      date: Date;
      buffer: Buffer;
      regexp: RegExp;
      bigint: bigint;
    }
    type FlattenB = Flatten<B>;
    expect<FlattenB>().type.toBe<{ date: Date; buffer: Buffer; regexp: RegExp; bigint: bigint }>();
  });
  test('with annotations', () => {
    interface B {
      default: Default<number, 1>;
      ref: Ref<TestUser>;
      id: MongoId;
    }
    type FlattenB = Flatten<B>;
    expect<FlattenB>().type.toBe<{ default: Default<number, 1>; ref: Ref<TestUser>; id: MongoId }>();
  });
});
