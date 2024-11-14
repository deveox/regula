import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { ReflectionKind } from '@deepkit/type';
import { ReflectedType } from './ReflectedType.js';

export default function () {
  describe('ReflectedType', () => {
    it('of()', () => {
      const t = ReflectedType.of<string>();
      expect(t.$.kind).toEqual(ReflectionKind.string);
    });
  });
}
