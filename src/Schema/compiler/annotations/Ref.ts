import { Document } from '../Document.js';
import { AnyFix } from '../types/utils.js';
import { MongoId } from './MongoId.js';
import { HasAnnotationType, TypeAnnotation } from './TypeAnnotation.js';

export const RefKey = '__dbRef';
/**
 * Ref type is a representation of a MongoDB reference.
 *
 * @example
 * class User {
 *  org: Ref<Org>
 * }
 * // mongoose equivalent:
 * const User = new Schema({
 *   org: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' }
 * })
 */
export type Ref<T extends Document> = (T | MongoId) & TypeAnnotation<typeof RefKey, T>;

export namespace Ref {
  type _In<T> = T extends (infer El)[] ? HasAnnotationType<El, typeof RefKey> : HasAnnotationType<T, typeof RefKey>;

  export type In<T> = _In<AnyFix<T>>;

  export type Keys<T> = keyof {
    [K in keyof T as true extends In<AnyFix<T[K]>> ? K : never]: undefined;
  };

  type _Populated<T> = T extends Ref<infer U> ? U : never;
  export type Populated<T> = T extends (infer El)[] ? _Populated<El>[] : _Populated<T> | null;

  export type PopulatedSignature<T> = Populated<T> extends (infer U)[] ? U : NonNullable<Populated<T>>;
}
