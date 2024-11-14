import { ReflectionKind, typeOf } from '@deepkit/type';
import mongoose from 'mongoose';
import { Primitive } from './Primitive.js';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';
import { TypeClass } from './types.js';
import { getTypeSchema } from './utils.js';

/**
 * Map reflects the Map type to Mongoose schema
 *
 * @example
 * console.log(new Class({type: typeOf<Map<string, number>>()}).toMongoose())
 * // {type: Map, of: {type: Number}}
 */
export class Map extends Schema {
  override readonly type: Map.Options['type'];
  readonly key: Schema;
  readonly value: Schema;
  readonly mongoose: mongoose.SchemaTypeOptions<unknown>;
  constructor(options: Map.Options) {
    super(options);
    this.type = options.type;
    const keyArg = this.type.$.arguments?.[0];
    if (!keyArg) {
      // if Map defined without generic arguments, throw
      throw this.unsupportedKeyType(`Map<unknown>`);
    }
    this.key = getTypeSchema(keyArg, this); // get schema for key type
    if (!(this.key instanceof Primitive) || this.key.type.$.kind !== ReflectionKind.string) {
      // if Map key is not a string, throw, since mongo supports only string keys
      throw this.unsupportedKeyType(`Map<${this.key.type}>`);
    }
    if (this.type.$.arguments?.[1]) {
      // if Map has second generic argument, get schema for it
      this.value = getTypeSchema(this.type.$.arguments[1], this);
    } else {
      // if no second generic argument, value is unknown
      this.value = getTypeSchema(typeOf<unknown>(), this);
    }
    this.mongoose = { type: globalThis.Map, of: this.value.mongoose };
  }
}

export namespace Map {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeClass<typeof globalThis.Map>>;
  }
}
