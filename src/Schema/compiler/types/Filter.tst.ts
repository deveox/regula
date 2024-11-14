import mongoose from 'mongoose';
import { describe, expect, test } from 'tstyche';
import { Filter } from './Filter.js';
import { TestUser } from './utils.test.js';

describe('Filter', () => {
  test('mongoose compatibility', () => {
    // @ts-expect-no-error
    const _: mongoose.FilterQuery<TestUser> = {} as Filter<TestUser>;
    expect<Filter<TestUser>>().type.toBeAssignableTo<mongoose.FilterQuery<TestUser>>();
    const _2: mongoose.FilterQuery<any>[] = {} as Filter<Record<string, any>>[];
  });
});
