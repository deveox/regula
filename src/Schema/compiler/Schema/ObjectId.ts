import { TypeString } from '@deepkit/type';
import mongoose from 'mongoose';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';

/**
 * ObjectId reflect TypeScript MongoId to Mongoose schema
 */
export class ObjectId extends Schema {
  override readonly type: ObjectId.Options['type'];
  readonly mongoose: mongoose.SchemaTypeOptions<unknown>;
  constructor(options: ObjectId.Options) {
    super(options);
    this.type = options.type;
    this.mongoose = {
      type: mongoose.Schema.Types.ObjectId,
      get: (v?: mongoose.Types.ObjectId) => v?.toString(),
    };
  }
}

export namespace ObjectId {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeString>;
  }
}
