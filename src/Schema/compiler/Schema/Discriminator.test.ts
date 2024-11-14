import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import { typeOf } from '@deepkit/type';
import mongoose from 'mongoose';
import { Document } from '../Document.js';
import { Discriminator } from '../annotations/Discriminator.js';
import { getTypeSchema } from './utils.js';

type __applyDiscriminator = { schema?: { type?: mongoose.Schema } };
interface withDiscriminators {
  _applyDiscriminators?: Map<string, __applyDiscriminator>;
}

export default function () {
  describe('Discriminator', () => {
    enum Type {
      A = 'A',
      B = 'B',
    }
    it('of Classes', () => {
      abstract class Base extends Document {
        name!: string;
        abstract type: Type;
      }
      class A extends Base {
        type!: Type.A;
        age!: number;
      }
      class B extends Base {
        type!: Type.B;
        amount!: number;
      }
      const schema = getTypeSchema(typeOf<Discriminator<A | B, 'type'>>()).mongoose.type;
      validateSchema(schema);
    });
    it('of Interfaces', () => {
      interface Base {
        type: Type;
        name: string;
      }
      interface A extends Base {
        type: Type.A;
        age: number;
      }
      interface B extends Base {
        type: Type.B;
        amount: number;
      }
      const schema = getTypeSchema(typeOf<Discriminator<A | B, 'type'>>()).mongoose.type;
      validateSchema(schema);
    });
    it('of Classes and Interfaces', () => {
      interface Base {
        type: Type;
        name: string;
      }
      class A extends Document implements Base {
        type!: Type.A;
        name!: string;
        age!: number;
      }
      interface B extends Base {
        type: Type.B;
        amount: number;
      }
      const schema = getTypeSchema(typeOf<Discriminator<A | B, 'type'>>()).mongoose.type;
      validateSchema(schema);
    });
  });
}

function validateSchema(schema: mongoose.Schema | unknown) {
  if (schema instanceof mongoose.Schema) {
    expect((schema as any).options._id).toBeFalsy();
    expect((schema as any).options.discriminatorKey).toEqual('type');
    const discriminators = (schema as unknown as withDiscriminators)._applyDiscriminators;
    expect(discriminators).toBeInstanceOf(Map);
    const a = discriminators?.get('A');
    const aSchema = a?.schema?.type;
    expect(aSchema).toBeInstanceOf(Object);
    expect(aSchema?.paths.name.options.type).toEqual(String);
    expect(aSchema?.paths.age.options.type).toEqual(Number);
    expect(aSchema?.paths.amount).toBeUndefined();
    const b = discriminators?.get('B');
    const bSchema = b?.schema?.type;
    expect(bSchema).toBeInstanceOf(Object);
    expect(bSchema?.paths.name.options.type).toEqual(String);
    expect(bSchema?.paths.amount.options.type).toEqual(Number);
    expect(bSchema?.paths.age).toBeUndefined();
  } else {
    expect(schema).toBeInstanceOf(mongoose.Schema);
  }
}
