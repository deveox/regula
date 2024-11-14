import { TypeLiteral } from '@deepkit/type';
import mongoose from 'mongoose';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';

/**
 * Literal reflect TypeScript literals to Mongoose schema
 *
 * [TS Doc](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
 *
 * ! Object Literals are not included, see ObjectLiteral
 *
 * @example
 * console.log(new Literal({type: typeOf<1>()}).toMongoose())
 * // {type: Number, enum: [1]}
 * console.log(new Literal({type: typeOf<'a'>()}).toMongoose())
 * // {type: String, enum: ['a']}
 * console.log(new Literal({type: typeOf<true>()}).toMongoose())
 * // {type: Boolean}
 * console.log(new Literal({type: typeOf<1n>()}).toMongoose())
 * // {type: BigInt}
 */
export class Literal extends Schema {
  override readonly type: Literal.Options['type'];
  readonly mongoose: mongoose.SchemaTypeOptions<unknown>;
  constructor(options: Literal.Options) {
    super(options);
    this.type = options.type;
    this.mongoose = this.toMongoose();
  }

  protected toMongoose() {
    switch (typeof this.type.$.literal) {
      case 'string':
        return { type: String, enum: [this.type.$.literal] };
      case 'number':
        return { type: Number, enum: [this.type.$.literal] };
      case 'boolean':
        return {
          type: Boolean,
          validate: (v: unknown) => {
            return v === this.type.$.literal;
          },
        };
      case 'bigint':
        return {
          type: mongoose.Schema.Types.BigInt,
          validate: (v: unknown) => v === this.type.$.literal,
        };
      default:
        throw this.unsupportedType();
    }
  }
}

export namespace Literal {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeLiteral>;
  }
}
