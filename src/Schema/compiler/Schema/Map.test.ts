import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import mongoose from 'mongoose';
import { UnsupportedKeyTypeError } from './errors.js';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('Map', () => {
    it('Simple Map', () => {
      const schema = getTypeSchema(typeOf<Map<string, number>>());
      expect(schema.mongoose.type).toEqual(Map);
      expect(schema.mongoose.of).toEqual({ type: Number });
    });
    it('Map with unknown values', () => {
      const schema = getTypeSchema(typeOf<Map<string, unknown>>());
      expect(schema.mongoose.type).toEqual(Map);
      expect(schema.mongoose.of).toEqual({
        type: mongoose.Schema.Types.Mixed,
      });
      // @ts-expect-error - should not allow to pass wrong type
      const schema2 = getTypeSchema(typeOf<Map<string>>());
      expect(schema2.mongoose.type).toEqual(Map);
      expect(schema2.mongoose.of).toEqual({
        type: mongoose.Schema.Types.Mixed,
      });
    });
    it('Nested Map', () => {
      const schema = getTypeSchema(typeOf<Map<string, Map<string, Map<string, number>>>>());
      expect(schema.mongoose.type).toEqual(Map);
      expect(schema.mongoose.of).toEqual({
        type: Map,
        of: { type: Map, of: { type: Number } },
      });
    });
    it('should throw if Map key is not a string', () => {
      expect(() => getTypeSchema(typeOf<Map<number, number>>())).toThrow(UnsupportedKeyTypeError);
      expect(() => getTypeSchema(typeOf<Map<boolean, number>>())).toThrow(UnsupportedKeyTypeError);
    });
  });
}
