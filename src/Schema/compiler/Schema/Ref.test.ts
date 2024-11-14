import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import mongoose from 'mongoose';
import { Document } from '../Document.js';
import { Ref } from '../annotations/Ref.js';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('Ref', () => {
    it('Ref', () => {
      class Org extends Document {}
      const t = typeOf<Ref<Org>>();
      const schema = getTypeSchema(t);
      console.log(schema.mongoose);
      expect(schema.mongoose.ref).toEqual('Org');
      expect(schema.mongoose.type).toEqual(mongoose.Schema.Types.ObjectId);
      expect(typeof schema.mongoose.get).toEqual('function');
      const id = new mongoose.Types.ObjectId();
      expect(schema.mongoose.get!(id)).toEqual(id.toString());
    });
  });
}
