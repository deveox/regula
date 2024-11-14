import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import mongoose from 'mongoose';
import { UnsupportedTypeError } from './errors.js';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('Primitive', () => {
    it('unknown and any', () => {
      const unknown = getTypeSchema(typeOf<unknown>());
      expect(unknown.mongoose.type).toEqual(mongoose.Schema.Types.Mixed);
      const any = getTypeSchema(typeOf<any>());
      expect(any.mongoose.type).toEqual(mongoose.Schema.Types.Mixed);
    });
    it('string', () => {
      const string = getTypeSchema(typeOf<string>());
      expect(string.mongoose.type).toEqual(String);
    });
    it('bigint', () => {
      const bigint = getTypeSchema(typeOf<bigint>());
      expect(bigint.mongoose.type).toEqual(mongoose.Schema.Types.BigInt);
    });
    it('number', () => {
      const number = getTypeSchema(typeOf<number>());
      expect(number.mongoose.type).toEqual(Number);
    });
    it('boolean', () => {
      const boolean = getTypeSchema(typeOf<boolean>());
      expect(boolean.mongoose.type).toEqual(Boolean);
    });
    it('string enum', () => {
      enum StringEnum {
        A = 'a',
        B = 'b',
      }
      const enumType = getTypeSchema(typeOf<StringEnum>());
      expect(enumType.mongoose.type).toEqual(String);
      expect(enumType.mongoose.enum).toEqual(['a', 'b']);
    });
    it('number enum', () => {
      enum NumberEnum {
        A = 1,
        B = 2,
      }
      const enumType = getTypeSchema(typeOf<NumberEnum>());
      expect(enumType.mongoose.type).toEqual(Number);
      expect(enumType.mongoose.enum).toEqual([1, 2]);
    });
    it('template literal', () => {
      const templateLiteral = getTypeSchema(typeOf<`a${string}`>());
      expect(templateLiteral.mongoose.type).toEqual(String);
    });
    it('throws on unsupported', () => {
      expect(() => getTypeSchema(typeOf<Promise<unknown>>())).toThrow(UnsupportedTypeError);
      expect(() => getTypeSchema(typeOf<() => number>())).toThrow(UnsupportedTypeError);
      enum Mixed {
        A = 'a',
        B = 1,
      }
      expect(() => getTypeSchema(typeOf<Mixed>())).toThrow(UnsupportedTypeError);
    });
  });
}
