import mongoose from 'mongoose';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';
import { TypeClass } from './types.js';

/**
 * Date reflects the Date type to Mongoose schema
 *
 * @example
 * console.log(new Date({type: typeOf<globalThis.Date>()}).toMongoose())
 * // {type: Date}
 */
export class Date extends Schema {
  override readonly type: Date.Options['type'];
  readonly mongoose: mongoose.SchemaTypeOptions<unknown>;
  constructor(options: Date.Options) {
    super(options);
    this.type = options.type;
    this.mongoose = { type: globalThis.Date };
  }
}

export namespace Date {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeClass<typeof globalThis.Date>>;
  }
}
