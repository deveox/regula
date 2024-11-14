import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import mongoose from 'mongoose';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('Union', () => {
    it('Mixed union', () => {
      const schema = getTypeSchema(typeOf<string | number>());
      expect(schema.mongoose.type).toEqual(mongoose.Schema.Types.Mixed);
    });
    it('String union', () => {
      const schema = getTypeSchema(typeOf<'a' | 'b'>());
      expect(schema.mongoose.type).toEqual(String);
      expect(schema.mongoose.enum).toEqual(['a', 'b']);
      const schema2 = getTypeSchema(typeOf<'a' | 'b' | string>());
      expect(schema2.mongoose.type).toEqual(String);
      expect(schema2.mongoose.enum).toBeUndefined();
    });
    it('Number union', () => {
      const schema = getTypeSchema(typeOf<1 | 2>());
      expect(schema.mongoose.type).toEqual(Number);
      expect(schema.mongoose.enum).toEqual([1, 2]);
      const schema2 = getTypeSchema(typeOf<1 | 2 | number>());
      expect(schema2.mongoose.type).toEqual(Number);
      expect(schema2.mongoose.enum).toBeUndefined();
    });
  });
}
