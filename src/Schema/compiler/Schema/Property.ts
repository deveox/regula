import { ReflectionKind, TypeProperty, TypePropertySignature } from '@deepkit/type';
import { SchemaTypeOptions } from 'mongoose';
import { DefaultKey } from '../annotations/Default.js';
import { Class } from './Class.js';
import { ObjectLiteral } from './ObjectLiteral.js';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';
import { UnsupportedKeyTypeError } from './errors.js';
import { getTypeSchema } from './utils.js';

export class Property extends Schema {
  readonly schema: Schema;
  override readonly parent: Property.Options['parent'];
  override readonly name: string;
  readonly property: Property.Options['property'];
  readonly mongoose: SchemaTypeOptions<unknown>;
  constructor(options: Property.Options) {
    if (typeof options.property.name !== 'string') {
      throw new UnsupportedKeyTypeError(`${options.parent.path}.${options.property.name.toString}`, typeof options.property.name);
    }
    super({
      parent: options.parent,
      name: options.property.name,
      type: new ReflectedType(options.property.type),
    });
    this.parent = options.parent;
    this.property = options.property;
    this.name = options.property.name;
    this.schema = getTypeSchema(this.type, this.parent, this.name);
    this.mongoose = this.toMongoose();
  }

  protected toMongoose() {
    // clone first level of schema to avoid modifying original schema
    const res = { ...this.schema.mongoose };
    const hasDefault = this.type.annotations?.[DefaultKey];
    if (hasDefault) {
      // Default annotation found, validate it
      if (this.property.optional) {
        // Default annotation should be used only with required properties
        // because it will never be undefined
        throw this.wrongModifier(
          'optional',
          'required',
          'If you use Default annotation, property should be required, because it will never be undefined'
        );
      }
      if (!hasDefault[0]) {
        // Default annotation should have a value
        // should never happen, because TS checks Default annotation
        throw this.wrongType('Default', 'Default');
      }
      // get schema of default value
      const dsh = getTypeSchema(hasDefault[0], this.parent, this.name);
      if (dsh.mongoose.type !== res.type || hasDefault[0].kind !== ReflectionKind.literal) {
        // schema of default annotation should have the same type as property
        throw this.wrongType(`Default<${this.type}, ${dsh.type}>`, `Default<${this.type}, literal of ${this.type} }>`);
      }
      res.default = hasDefault[0].literal;
    } else {
      if (!this.property.optional) {
        res.required = true;
      }
    }
    return res;
  }
}

export namespace Property {
  export interface Options {
    parent: Class | ObjectLiteral;
    /**
     * If schema is inside object/class, this should be set
     * `@depkit/type` reflected property
     */
    property: TypeProperty | TypePropertySignature;
  }
}
