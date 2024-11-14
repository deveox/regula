import { SchemaTypeOptions } from 'mongoose';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';

/**
 * Buffer maps TypeScript `MongoBuffer` to Buffer in Mongoose schema
 */
export class Buffer extends Schema {
  override readonly type: Buffer.Options['type'];
  readonly mongoose: SchemaTypeOptions<unknown>;
  constructor(options: Buffer.Options) {
    super(options);
    this.type = options.type;
    this.mongoose = { type: 'Buffer' };
  }
}

export namespace Buffer {
  export interface Options extends Schema.Options {
    type: ReflectedType;
  }
}
