import { ReflectionKind, TypeClass, TypeLiteral, TypeUnion } from '@deepkit/type';
import mongoose from 'mongoose';
import { Annotation } from '../annotations/index.js';
import { Class } from './Class.js';
import { Literal } from './Literal.js';
import { ObjectLiteral } from './ObjectLiteral.js';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';
import { UnsupportedTypeError, WrongTypeError } from './errors.js';

export class Discriminator extends Schema {
  override readonly type: Discriminator.Options['type'];
  readonly key: string;
  readonly mongoose: mongoose.SchemaTypeOptions<unknown>;
  readonly values: Record<string, Schema> = {};

  protected classes: TypeClass[] = [];
  constructor(options: Discriminator.Options) {
    super(options);
    this.type = options.type;
    this.key = this.parseKey(options);
    const base = new mongoose.Schema(
      {
        [this.key]: String,
      },
      { discriminatorKey: this.key, _id: false }
    );
    // go over union types
    for (const t of this.type.$.types) {
      let value: Class | ObjectLiteral;
      switch (t.kind) {
        case ReflectionKind.class:
          // found a class in union, get class schema
          value = Class.new({ type: new ReflectedType(t) });
          break;
        case ReflectionKind.objectLiteral:
          // found an object literal in union, get object literal schema
          value = ObjectLiteral.new({ type: new ReflectedType(t) });
          break;
        default:
          // Discriminator can be used only with classes or object literals
          // should never happen, because TS checks Discriminator annotation
          throw this.unsupportedType(
            `Discriminator<${this.type}, '${this.key}'>`,
            `Discriminator values should be classes or object literals (interfaces). Invalid: ${ReflectedType.toString(t)}`
          );
      }
      const keyProperty = value.properties[this.key];
      if (!keyProperty) {
        // if discriminator key is not found in class or object literal, throw
        // should never happen, because TS checks Discriminator annotation
        throw new WrongTypeError(
          `${this.path}.${this.key}`,
          'undefined',
          'Discriminator value should have a discriminator key as a property'
        );
      }
      if (!(keyProperty.schema instanceof Literal) || typeof keyProperty.schema.type.$.literal != 'string') {
        // if value of discriminator key is not a literal, throw
        // can happen if Discriminator annotation is used incorrectly
        throw new WrongTypeError(
          `${this.path}.${this.key}`,
          keyProperty.type.toString(),
          `literal of string`,
          'Discriminator key should be a literal string value'
        );
      }
      const keyValue = keyProperty.schema.type.$.literal;
      if (this.values[keyValue]) {
        // if discriminator key value is not unique, throw
        throw new WrongTypeError(
          `${this.path}.${this.key}`,
          keyValue,
          'unique',
          `Discriminator values should be unique. Value '${keyValue}' is already used in ${this.values[keyValue].type}`
        );
      }
      this.values[keyValue] = value;
    }
    if (Object.keys(this.values).length === 0) {
      // if no discriminator values are found, throw
      // should never happen, because TS checks Discriminator annotation
      throw new UnsupportedTypeError(this.path, 'empty', 'Discriminator should have at least one value');
    }
    for (const [k, v] of Object.entries(this.values)) {
      base.discriminator(k, v.mongoose);
    }
    this.mongoose = { type: base };
  }

  private parseKey(options: Discriminator.Options) {
    const keyType = options.discriminatorAnnotation[0];
    if (keyType.kind !== ReflectionKind.literal || typeof keyType.literal !== 'string') {
      throw this.wrongType(
        `Discriminator<${this.type}, ${keyType}>`,
        `Discriminator<${this.type}, 'keyName'>`,
        'Discriminator key should be a string literal'
      );
    }
    return keyType.literal;
  }
}

export namespace Discriminator {
  export interface Options extends Schema.Options {
    type: ReflectedType<TypeUnion>;
    discriminatorAnnotation: Annotation['options'];
  }

  export interface Key {
    name: string;
    type: TypeLiteral;
  }
}
