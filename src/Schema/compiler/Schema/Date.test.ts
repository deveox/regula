import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('Date', () => {
    it('Date', () => {
      const schema = getTypeSchema(typeOf<Date>());
      expect(schema.mongoose.type).toEqual(Date);
    });
  });
}
