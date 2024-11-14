import { describe, it } from 'bun:test';
import { expect } from 'bun:test';
import mongoose from 'mongoose';
import { Document } from '../Document.js';
import { Default } from '../annotations/Default.js';
import { MongoId } from '../annotations/MongoId.js';
import { UnsupportedTypeError, WrongModifierError, WrongTypeError, WrongVisibilityError } from './errors.js';
import { register } from './index.js';

export default function () {
  describe('Class', () => {
    class Org extends Document {
      required!: string;
      declare required2: string;
      optional?: number;

      private private?: string;
      protected protected?: string;
      public public?: string;
      public2?: string;

      withDefault!: Default<string, 'test'>;
    }
    const schema = register(Org).mongoose.type;
    it('Document', () => {
      expect(schema).toBeInstanceOf(mongoose.Schema);
    });

    it('required and optional', () => {
      expect(schema.paths.required.isRequired).toBeTruthy();
      expect(schema.paths.optional.isRequired).toBeUndefined();
      expect(schema.paths.required2.isRequired).toBeTruthy();
    });
    it('private and protected', () => {
      expect(schema.paths.private).toBeUndefined();
      expect(schema.paths.protected).toBeUndefined();
      expect(schema.paths.public).toBeInstanceOf(mongoose.SchemaType);
      expect(schema.paths.public2).toBeInstanceOf(mongoose.SchemaType);
    });
    it('Default annotation', () => {
      expect(schema.paths.withDefault.options.default).toEqual('test');
      class ToThrow extends Document {
        withOptionalDefault?: Default<string, 'test'>;
      }
      expect(() => register(ToThrow)).toThrow(WrongModifierError);
    });
    it('timestamps', () => {
      class WithTimestamps extends Document {
        createdAt!: Date;
        updatedAt!: Date;
      }
      const schema = register(WithTimestamps).mongoose.type;
      expect((schema as any).options.timestamps).toEqual({
        createdAt: true,
        updatedAt: true,
      });
      class CreatedAt extends Document {
        createdAt!: Date;
      }
      const schema2 = register(CreatedAt).mongoose.type;
      expect((schema2 as any).options.timestamps).toEqual({
        createdAt: true,
      });
      class UpdatedAt extends Document {
        updatedAt!: Date;
      }
      const schema3 = register(UpdatedAt).mongoose.type;
      expect((schema3 as any).options.timestamps).toEqual({
        updatedAt: true,
      });

      class WrongType extends Document {
        createdAt!: string;
      }
      expect(() => register(WrongType)).toThrow(WrongTypeError);
    });
    it('_id', () => {
      class WithId extends Document {
        readonly _id!: MongoId;
      }
      const schema = register(WithId).mongoose.type;
      expect((schema as any).options._id).toBeTruthy();
      class WithoutId extends Document {
        name!: string;
      }
      const schema2 = register(WithoutId).mongoose.type;
      expect((schema2 as any).options._id).toBeFalsy();

      class WithWrongId extends Document {
        _id!: string;
      }
      expect(() => register(WithWrongId)).toThrow(WrongTypeError);
      class WithWrongId2 extends Document {
        protected _id!: MongoId;
      }
      expect(() => register(WithWrongId2)).toThrow(WrongVisibilityError);
      class WithWrongId3 extends Document {
        private _id!: MongoId;
      }
      expect(() => register(WithWrongId3)).toThrow(WrongVisibilityError);
    });
    it('methods', () => {
      class WithMethod extends Document {
        name!: string;
        test() {
          return 1;
        }
      }
      const schema = register(WithMethod).mongoose.type;
      expect(schema.methods.test).toEqual(WithMethod.prototype.test);
    });
    it('throws on unsupported type', () => {
      class NotADocument {
        a!: string;
      }
      expect(() => register(NotADocument)).toThrow(UnsupportedTypeError);

      class IndexSignature extends Document {
        [key: string]: boolean | undefined;
      }
      expect(() => register(IndexSignature)).toThrow(UnsupportedTypeError);
    });
  });
}
