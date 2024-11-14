import { TypeUnion } from '@deepkit/type';
import mongoose from 'mongoose';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';
import { getTypeSchema } from './utils.js';

/**
 * Union reflect TypeScript union types to Mongoose schema
 * Also it's used for creating `Discriminators` (DiscriminatorSchema) and `Refs`
 *
 * If union is of string or number, it will try to make enum
 * [TS Doc](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
 * @example
 * console.log(new Union({type: typeOf<'a' | 'b'>()}).toMongoose())
 * // {type: String, enum: ['a', 'b']}
 * console.log(new Union({type: typeOf<1 | 2>()}).toMongoose())
 * // {type: Number, enum: [1, 2]}
 * console.log(new Union({type: typeOf<'a' | 1>()}).toMongoose())
 * // {type: mongoose.Schema.Types.Mixed}
 * console.log(new Union({type: typeOf<{a: string} | {b: number}>()}).toMongoose())
 * // {type: mongoose.Schema.Types.Mixed}
 * console.log(new Union({type: typeOf<Ref<User>>}).toMongoose())
 * // {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
 * class Schema extends Document {
 *   type: 1 | 2
 * }
 *
 * class A extends Schema {
 *   type: 1
 *   a: string
 * }
 * class B extends Schema {
 *   type: 2
 *   b: number
 * }
 *
 * console.log(new Union({type: typeOf<Discriminator<A | B, 'type'>>}).toMongoose())
 */
export class Union extends Schema {
  override readonly type: Union.Options['type'];
  readonly mongoose: mongoose.SchemaTypeOptions<unknown>;
  readonly values: Schema[] = [];
  constructor(options: Union.Options) {
    super(options);
    this.type = options.type;
    this.values = this.type.$.types.map((t) => getTypeSchema(t, this.parent, this.name));
    if (this.values.length === 0) {
      // should never happen, because TS doesn't allow empty unions
      this.wrongType(`|`, `Union`, 'Union should have at least one type');
    }
    this.mongoose = this.toMongoose();
  }

  protected toMongoose() {
    const els = this.values.map((v) => v.mongoose);
    // get schemas for all union members
    if (els[0].type === Object) {
      // if first element is object, we can't narrow the type
      return { type: mongoose.Schema.Types.Mixed };
    }
    for (const el of els) {
      if (el.type !== els[0].type) {
        // if one of the elements has different type, we can't narrow the type
        return { type: mongoose.Schema.Types.Mixed };
      }
    }
    // all elements have the same type and it's not object
    if (els[0].type === String || els[0].type === Number) {
      // the type is string or number we can try to make enum
      const en: (string | number)[] = [];
      for (const el of els) {
        if (el.enum) {
          en.push(...(el.enum as (string | number)[]));
        } else {
          // if one of the elements is not enum, we can't make enum
          return { type: els[0].type };
        }
      }
      return { type: els[0].type, enum: en };
    }
    // return the first element type, since all elements have the same type
    return els[0];
  }
}

export namespace Union {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeUnion>;
  }
}
