import { ReflectionClass, ReflectionKind, ReflectionVisibility, TypeClass } from '@deepkit/type';
import mongoose from 'mongoose';
import { Document } from '../Document.js';
import { Property } from './Property.js';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';
import { UnsupportedKeyTypeError, WrongTypeError, WrongVisibilityError } from './errors.js';

/**
 * Class reflects TypeScript class to Mongoose schema
 *
 * [TS Doc](https://www.typescriptlang.org/docs/handbook/2/classes.html)
 * @example
 * import { Document } from '@/orm'
 * class MyClass extends Document {
 *   key1!: string
 * }
 * console.log(new Class({type: typeOf<MyClass>()}).toMongoose())
 * // {key1: {type: String, required: true}}
 */
export class Class extends Schema {
  protected static readonly cache: Record<number, Class> = {};
  static new(options: Class.Options, config?: Class.Config): Class {
    if (options.type.$.id && this.cache[options.type.$.id]) {
      return this.cache[options.type.$.id];
    }
    return new Class(options, config);
  }

  override readonly type: Class.Options['type'];
  readonly properties: Record<string, Property> = {};
  readonly options: mongoose.SchemaOptions;
  readonly mongoose: { type: mongoose.Schema };

  private constructor(options: Class.Options, config?: Class.Config) {
    super(options);
    this.options = {
      ...config,
      _id: false,
    };
    this.type = options.type;
    const isSupported = this.isSupported();
    if (!isSupported) {
      throw this.unsupportedType(
        this.type.toString(),
        'Only built-in classes (Map, Date, Set) and classes that extend Document are supported'
      );
    }

    // go over class methods and properties
    for (const t of this.type.$.types) {
      switch (t.kind) {
        case ReflectionKind.property: {
          // type is property
          switch (t.visibility) {
            case ReflectionVisibility.private:
            case ReflectionVisibility.protected:
              // protected and private properties are not mapped to the schema
              if (t.name === '_id') {
                // _id can't be protected or private - throw
                throw new WrongVisibilityError(t.name, t.visibility, 'public');
              }
              continue;
          }
          const p = new Property({ parent: this, property: t });
          switch (p.name) {
            case '_id': {
              // _id should always be of type MongoId, which translate to ObjectId
              if (p.mongoose.type !== mongoose.Schema.Types.ObjectId) {
                // throw if not MongoId
                throw new WrongTypeError(`${this.path}.${p.name}`, p.type.toString(), 'MongoId');
              }
              // enable _id in Mongoose schema options
              this.options._id = true;
              continue;
            }
            case 'updatedAt':
            case 'createdAt':
              // found timestamp
              if (p.mongoose.type !== Date) {
                // if timestamp type is not a Date - throw
                throw new WrongTypeError(`${this.path}.${p.name}`, p.type.toString(), 'Date');
              }
              if (!this.options.timestamps || this.options.timestamps === true) {
                this.options.timestamps = {};
              }
              // enable timestamp in Mongoose schema options
              this.options.timestamps[p.name] = true;
              continue;
          }

          this.properties[p.name] = p;
          break;
        }
        case ReflectionKind.method:
          if (!this.options.methods) {
            this.options.methods = {};
          }
          if (typeof t.name !== 'string') {
            throw new UnsupportedKeyTypeError(`${this.path}.${t.name.toString()}`, typeof t.name);
          }
          // add method to Mongoose schema options
          this.options.methods[t.name] = this.type.$.classType.prototype[t.name];
          break;
        case ReflectionKind.indexSignature:
          throw this.unsupportedType('index signature', 'Index signatures are not supported in class schema');
      }
    }
    this.mongoose = this.toMongoose();
    if (this.type.$.id) {
      Class.cache[this.type.$.id] = this;
    }
  }

  private isSupported() {
    // get current class
    const c = ReflectionClass.from(this.type.$.classType);
    // set cursor to current class
    let cursor: ReflectionClass<any> | undefined = c;
    // look for parent (extend) of Document
    for (;;) {
      cursor = cursor.getSuperReflectionClass();
      if (!cursor || cursor.type.kind !== ReflectionKind.class) {
        return false;
      }
      if (cursor.type.classType === Document) {
        // found document, class is supported
        return true;
      }
    }
    return false;
  }

  private toMongoose() {
    const embedded: Record<string, mongoose.SchemaTypeOptions<unknown>> = {};
    for (const [k, p] of Object.entries(this.properties)) {
      embedded[k] = p.mongoose;
    }
    return { type: new mongoose.Schema(embedded, this.options) };
  }
}

export namespace Class {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeClass>;
  }

  export type Config = Omit<mongoose.SchemaOptions, '_id' | 'timestamps'>;
}
