import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import mongoose from 'mongoose';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('Literal', () => {
    it('string', () => {
      const schema = getTypeSchema(typeOf<'a'>());
      expect(schema.mongoose.type).toEqual(String);
      expect(schema.mongoose.enum).toEqual(['a']);
    });
    it('number', () => {
      const schema = getTypeSchema(typeOf<1>());
      expect(schema.mongoose.type).toEqual(Number);
      expect(schema.mongoose.enum).toEqual([1]);
    });
    it('bigint', () => {
      const schema = getTypeSchema(typeOf<1n>());
      expect(schema.mongoose.type).toEqual(mongoose.Schema.Types.BigInt);
      expect(typeof schema.mongoose.validate).toEqual('function');
      if (typeof schema.mongoose.validate === 'function') {
        expect(schema.mongoose.validate(1n)).toEqual(true);
        expect(schema.mongoose.validate(2n)).toEqual(false);
      }
    });
    it('boolean', () => {
      const schema = getTypeSchema(typeOf<true>());
      expect(schema.mongoose.type).toEqual(Boolean);
      expect(typeof schema.mongoose.validate).toEqual('function');
      if (typeof schema.mongoose.validate === 'function') {
        expect(schema.mongoose.validate(true)).toEqual(true);
        expect(schema.mongoose.validate(false)).toEqual(false);
      }
    });
  });
}
