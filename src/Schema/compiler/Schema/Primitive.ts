import {
  ReflectionKind,
  TypeAny,
  TypeBigInt,
  TypeBoolean,
  TypeEnum,
  TypeNumber,
  TypeString,
  TypeTemplateLiteral,
  TypeUnknown,
} from '@deepkit/type';
import mongoose from 'mongoose';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';

/**
 * Primitive reflect TypeScript primitives to Mongoose schema
 *
 * [TS Doc](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean)
 * @example
 * console.log(new Primitive({type: typeOf<any>()}).toMongoose())
 * // {type: mongoose.Schema.Types.Mixed}
 * console.log(new Primitive({type: typeOf<unknown>()}).toMongoose())
 * // {type: mongoose.Schema.Types.Mixed}
 * console.log(new Primitive({type: typeOf<MongoBuffer>()}).toMongoose())
 * // {type: Buffer}
 * console.log(new Primitive({type: typeOf<MongoId>()}).toMongoose())
 * // {type: mongoose.Schema.Types.ObjectId, get: (v?: mongoose.Types.ObjectId) => v?.toString()}
 * console.log(new Primitive({type: typeOf<string>()}).toMongoose())
 * // {type: String}
 * console.log(new Primitive({type: typeOf<number>()}).toMongoose())
 * // {type: Number}
 * console.log(new Primitive({type: typeOf<boolean>()}).toMongoose())
 * // {type: Boolean}
 * console.log(new Primitive({type: typeOf<bigint>()}).toMongoose())
 * // {type: BigInt}
 * console.log(new Primitive({type: typeOf<`a${string}`>()}).toMongoose())
 * // {type: String} - template literal
 * enum A {
 *   A = 'a',
 *   B = 'b'
 * }
 * console.log(new Primitive({type: typeOf<A>()}).toMongoose())
 * // {type: String, enum: ['a', 'b']}
 */
export class Primitive extends Schema {
  override readonly type: Primitive.Options['type'];
  readonly mongoose: mongoose.SchemaTypeOptions<unknown>;
  constructor(options: Primitive.Options) {
    super(options);
    this.type = options.type;
    this.mongoose = this.toMongoose();
  }

  protected toMongoose() {
    switch (this.type.$.kind) {
      case ReflectionKind.any:
      case ReflectionKind.unknown:
        return { type: mongoose.Schema.Types.Mixed };
      case ReflectionKind.bigint:
        return { type: mongoose.Schema.Types.BigInt };
      case ReflectionKind.templateLiteral:
        return { type: String };
      case ReflectionKind.string:
        return { type: String };
      case ReflectionKind.number:
        return { type: Number };
      case ReflectionKind.boolean:
        return { type: Boolean };
      case ReflectionKind.enum:
        switch (this.type.$.indexType.kind) {
          case ReflectionKind.string:
            // mongoose supports string enums
            return {
              type: String,
              enum: this.type.$.values.map((v) => v) as string[],
            };
          case ReflectionKind.number:
            // mongoose supports number enums
            return {
              type: Number,
              enum: this.type.$.values.map((v) => v) as number[],
            };
        }
        // all other enums are not supported
        throw this.unsupportedType();
    }
  }
}

export namespace Primitive {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeAny | TypeUnknown | TypeBigInt | TypeTemplateLiteral | TypeString | TypeBoolean | TypeNumber | TypeEnum>;
  }
}
