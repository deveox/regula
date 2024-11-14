import mongoose from 'mongoose';
import { describe, expect, test } from 'tstyche';
import { Document } from './Document.js';
import { TestUser } from './types/utils.test.js';

describe('Document', () => {
  test('Hydrated', () => {
    const c: Document.Hydrated<TestUser> = {} as Document.Hydrated<TestUser>;
    c.$clone();
    // @ts-expect-no-error
    const _: mongoose.Document = {} as Document.Hydrated<TestUser>;
    expect<Document.Hydrated<TestUser>>().type.toBeAssignableTo<mongoose.Document>();
  });
});
