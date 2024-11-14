import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import mongoose from 'mongoose';
import { MongoId } from '../annotations/MongoId.js';
import { getTypeSchema } from './utils.js';

export default function () {
  describe('ObjectId', () => {
    it('ObjectId', () => {
      const schema = getTypeSchema(typeOf<MongoId>());
      expect(schema.mongoose.type).toEqual(mongoose.Schema.Types.ObjectId);
      expect(typeof schema.mongoose.get).toEqual('function');
      const id = new mongoose.Types.ObjectId();
      expect(schema.mongoose.get!(id)).toEqual(id.toString());
    });
  });
}
