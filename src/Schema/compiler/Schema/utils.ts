import { ReflectionKind, type Type, type TypeLiteral, type TypeObjectLiteral, type TypeString, type TypeUnion } from '@deepkit/type';
import { DiscriminatorKey } from '../annotations/Discriminator.js';
import { MongoBufferKey } from '../annotations/MongoBuffer.js';
import { MongoIdKey } from '../annotations/MongoId.js';
import { RefKey } from '../annotations/Ref.js';
import { Array } from './Array.js';
import { Buffer } from './Buffer.js';
import { Class } from './Class.js';
import { Date } from './Date.js';
import { Discriminator } from './Discriminator.js';
import { Literal } from './Literal.js';
import { Map } from './Map.js';
import { ObjectId } from './ObjectId.js';
import { ObjectLiteral } from './ObjectLiteral.js';
import { Primitive } from './Primitive.js';
import { Ref } from './Ref.js';
import { ReflectedType } from './ReflectedType.js';
import { Schema } from './Schema.js';
import { Union } from './Union.js';
import { UnsupportedTypeError } from './errors.js';

export function getTypeSchema(type: Type | ReflectedType, parent?: Schema, name?: string): Schema {
  const t = type instanceof ReflectedType ? type : new ReflectedType(type);
  switch (t.$.kind) {
    case ReflectionKind.literal: {
      return new Literal({ name, parent, type: t as ReflectedType<TypeLiteral> });
    }
    case ReflectionKind.string:
      if (t.annotations?.[MongoIdKey]) {
        // mongo id found
        return new ObjectId({ name, parent, type: t as ReflectedType<TypeString> });
      }
      return new Primitive({ name, parent, type: t as ReflectedType<TypeString> });
    case ReflectionKind.any:
    case ReflectionKind.unknown:
      if (t.annotations?.[MongoBufferKey]) {
        // mongo buffer found
        // MongoBuffer should be of type unknown in reflection, because `NodeJS.Buffer` is external type
        return new Buffer({ name, parent, type: t });
      }
      return new Primitive({ name, parent, type: t as Primitive.Options['type'] });
    case ReflectionKind.bigint:
    case ReflectionKind.templateLiteral:
    case ReflectionKind.number:
    case ReflectionKind.boolean:
    case ReflectionKind.enum:
      return new Primitive({ name, parent, type: t as Primitive.Options['type'] });
    case ReflectionKind.objectLiteral:
      return ObjectLiteral.new({ name, parent, type: t as ReflectedType<TypeObjectLiteral> });
    case ReflectionKind.class:
      switch (t.$.classType) {
        case globalThis.Date:
          // built-in Date found
          return new Date({ name, parent, type: t as Date.Options['type'] });
        case globalThis.Map:
          // built-in Map found
          return new Map({ name, parent, type: t as Map.Options['type'] });
        default:
          return Class.new({ name, parent, type: t as Class.Options['type'] });
      }
    case ReflectionKind.array:
      return new Array({ name, parent, type: t as Array.Options['type'] });
    case ReflectionKind.union:
      if (t.annotations?.[RefKey]) {
        // Ref found
        return new Ref({ name, parent, type: t, annotation: t.annotations[RefKey] });
      } else if (t.annotations?.[DiscriminatorKey]) {
        // Discriminator found
        return new Discriminator({
          parent,
          name,
          type: t as ReflectedType<TypeUnion>,
          discriminatorAnnotation: t.annotations[DiscriminatorKey],
        });
      }
      return new Union({ name, parent, type: t as ReflectedType<TypeUnion> });
    default: {
      let path = '';
      if (parent) {
        path = parent.name || '';
      }
      if (path && name) {
        path += '.';
        path += name;
      }
      throw new UnsupportedTypeError(path, t.toString());
    }
  }
}
