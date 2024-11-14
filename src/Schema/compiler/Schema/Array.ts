import { TypeArray } from '@deepkit/type';
import { SchemaTypeOptions } from 'mongoose';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';
import { getTypeSchema } from './utils.js';

/**
 * ArraySchema reflect TypeScript arrays and tuples to Mongoose schema
 *
 * [TS Doc](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
 * @example
 * type MyArray = string[]
 * console.log(new ArraySchema({type: typeOf<MyArray>()}).toMongoose())
 * // {type: [String]}
 */
export class Array extends Schema {
  override readonly type: Array.Options['type'];
  readonly elSchema: Schema;
  readonly mongoose: SchemaTypeOptions<unknown>;
  constructor(options: Array.Options) {
    super(options);
    this.type = options.type;
    this.elSchema = getTypeSchema(this.type.$.type, this, '[]');
    const el = this.elSchema.mongoose;
    const res: SchemaTypeOptions<unknown> = { type: [el.type] };
    if (el.enum) {
      // if element has enum, we can use it as enum for array
      res.enum = el.enum;
    }
    this.mongoose = res;
  }
}

export namespace Array {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeArray>;
  }
}
