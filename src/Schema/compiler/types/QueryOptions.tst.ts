import mongoose from 'mongoose';
import { describe, expect, test } from 'tstyche';
import { QueryOptions } from './QueryOptions.js';
import { TestUser } from './utils.test.js';

describe('Query Options', () => {
  test('mongoose compatibility', () => {
    // @ts-expect-no-error
    const _: mongoose.QueryOptions<TestUser> = {} as QueryOptions<TestUser>;
    expect<QueryOptions<TestUser>>().type.toBeAssignableTo<mongoose.QueryOptions<TestUser>>();
  });
});
