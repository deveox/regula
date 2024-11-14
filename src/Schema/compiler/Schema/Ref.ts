import mongoose from 'mongoose';
import type { Annotation } from '../annotations/index.js';
import { Schema } from './Schema.js';

/**
 * Ref maps TypeScript `Ref` to ObjectId in Mongoose schema
 */
export class Ref extends Schema {
  override readonly type: Ref.Options['type'];
  readonly mongoose: mongoose.SchemaTypeOptions<unknown>;
  constructor(options: Ref.Options) {
    super(options);
    this.type = options.type;
    const ref = options.annotation[0].typeName;
    if (!ref) {
      this.wrongType(`Ref<>`, `Ref<...?`, 'Ref annotation should have a class as an argument');
    }
    console.log(1, ref);
    this.mongoose = {
      type: mongoose.Schema.Types.ObjectId,
      ref,
      get: (v?: mongoose.Types.ObjectId | Record<string, unknown>) => {
        if (v instanceof mongoose.Types.ObjectId) {
          return v.toString();
        }
        return v;
      },
    };
  }
}

export namespace Ref {
  export interface Options extends Schema.Options {
    type: Schema.Options['type'];
    annotation: Annotation['options'];
  }
}
