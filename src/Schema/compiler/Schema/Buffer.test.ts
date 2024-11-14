import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import { MongoBuffer } from '../annotations/MongoBuffer.js';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('Buffer', () => {
    it('Buffer', () => {
      const schema = getTypeSchema(typeOf<MongoBuffer>());
      expect(schema.mongoose.type).toEqual('Buffer');
    });
  });
}
