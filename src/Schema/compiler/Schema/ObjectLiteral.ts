import { ReflectionKind, TypeObjectLiteral } from '@deepkit/type';
import mongoose, { SchemaTypeOptions } from 'mongoose';
import { Property } from './Property.js';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';
import { UnsupportedTypeError } from './errors.js';

/**
 * ObjectLiteral reflects TypeScript object literals and interfaces to Mongoose schema
 *
 * [TS Doc](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
 * @example
 * type MyObject = { key1: string }
 * console.log(new ObjectLiteral({type: typeOf<MyObject>()}).toMongoose())
 * // {type: new mongoose.Schema({key1: {type: String, required: true})}
 * interface MyInterface {
 *   nested: { key2: number }
 * }
 * console.log(new ObjectLiteral({type: typeOf<MyInterface>()}).toMongoose())
 * // {
 * //   type: new mongoose.Schema({
 * //       nested: new mongoose.Schema({
 * //          key2: {type: Number, required: true}
 * //       })
 * //    })
 * //  }
 * //
 */
export class ObjectLiteral extends Schema {
  protected static readonly cache: Record<number, ObjectLiteral> = {};
  override readonly type: ObjectLiteral.Options['type'];
  readonly properties: Record<string, Property> = {};
  readonly isRecord?: boolean;
  readonly mongoose: {
    type: mongoose.Schema | typeof mongoose.Schema.Types.Mixed;
  };

  static new(options: ObjectLiteral.Options): ObjectLiteral {
    if (options.type.$.id && this.cache[options.type.$.id]) {
      return this.cache[options.type.$.id];
    }
    return new ObjectLiteral(options);
  }

  private constructor(options: ObjectLiteral.Options) {
    super(options);
    this.type = options.type;

    loop: for (const pt of this.type.$.types) {
      switch (pt.kind) {
        case ReflectionKind.propertySignature: {
          const p = new Property({ parent: this, property: pt });
          this.properties[p.name] = p;
          break;
        }
        case ReflectionKind.indexSignature:
          // Index Signature found Record<..., ...> or { [key: string]: ... }
          this.isRecord = true;
          break loop;
        case ReflectionKind.methodSignature:
          throw new UnsupportedTypeError(
            `${this.path}.${pt.name.toString()}`,
            'function',
            'methods are not supported for object schema, use class instead'
          );
        case ReflectionKind.callSignature:
          throw this.unsupportedType('function', 'call signatures are not supported');
      }
    }

    if (!this.isRecord && Object.keys(this.properties).length === 0) {
      throw this.unsupportedType('empty object');
    }

    if (this.isRecord) {
      this.mongoose = { type: mongoose.Schema.Types.Mixed };
    } else {
      const embedded: SchemaTypeOptions<any> = {};
      for (const [k, p] of Object.entries(this.properties)) {
        embedded[k] = p.mongoose;
      }
      const schema = new mongoose.Schema(embedded);
      this.mongoose = { type: schema };
      if (this.type.$.id) {
        ObjectLiteral.cache[this.type.$.id] = this;
      }
    }
  }
}

export namespace ObjectLiteral {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeObjectLiteral>;
  }
}
