import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('Array', () => {
    it('primitive array', () => {
      const schema = getTypeSchema(typeOf<string[]>());
      expect(schema.mongoose.type).toEqual([String]);
    });
    it('matrix', () => {
      const schema = getTypeSchema(typeOf<string[][]>());
      expect(schema.mongoose.type).toEqual([[String]]);
    });
  });
}
