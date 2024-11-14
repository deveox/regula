import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import mongoose from 'mongoose';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('ObjectLiteral', () => {
    it('Object Literal', () => {
      const schema = getTypeSchema(
        typeOf<{
          name: string;
          optional?: number;
        }>()
      ).mongoose.type;
      if (schema instanceof mongoose.Schema) {
        expect(schema.paths.name.options.type).toEqual(String);
        expect(schema.paths.name.isRequired).toBeTruthy();
        expect(schema.paths.optional.options.type).toEqual(Number);
        expect(schema.paths.optional.isRequired).toBeUndefined();
      } else {
        expect(schema).toBeInstanceOf(mongoose.Schema);
      }
    });
    it('Record', () => {
      const schema = getTypeSchema(typeOf<Record<string, number>>()).mongoose;
      expect(schema).toEqual({ type: mongoose.Schema.Types.Mixed });

      const schema2 = getTypeSchema(typeOf<{ [key: string]: number }>()).mongoose;
      expect(schema2).toEqual({ type: mongoose.Schema.Types.Mixed });
    });
    it('Interface', () => {
      interface Base {
        name: string;
      }
      interface Extended extends Base {
        age: number;
      }
      const schema = getTypeSchema(typeOf<Extended>()).mongoose.type;
      if (schema instanceof mongoose.Schema) {
        expect(schema.paths.name.options.type).toEqual(String);
        expect(schema.paths.name.isRequired).toBeTruthy();
        expect(schema.paths.age.options.type).toEqual(Number);
        expect(schema.paths.age.isRequired).toBeTruthy();
      } else {
        expect(schema).toBeInstanceOf(mongoose.Schema);
      }
    });
  });
}
