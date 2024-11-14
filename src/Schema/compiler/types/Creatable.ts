import { AnyArray } from 'mongoose';
import { Default } from '../annotations/Default.js';
import { HasAnnotation } from '../annotations/TypeAnnotation.js';
import { IsObject } from './utils.js';

/**
 * A type representing a create request signature for a given document.
 *
 * Create signature makes fields with Default annotation optional.
 */
export type Creatable<T> = T extends AnyArray<infer El> // check if T is an array
  ? Creatable<El>[] // if T is an array, apply Creatable to its elements
  : IsObject<T> extends true // check if T is an object
    ? {
        // build an object with required keys from T

        [K in keyof T as T[K] extends (...args: any) => any // check if T[K] is a function
          ? never // if T[K] is a function, skip it
          : T[K] extends undefined // check if T[K] is optional
            ? never // if T[K] is optional, skip it
            : K extends Creatable.OptionalKeys | Creatable.IgnoredKeys // check if K is an optional key or an ignored key
              ? never // if K is an optional key or an ignored key, skip it
              : HasAnnotation<T[K], Default<unknown, any>> extends true // check if T[K] has a Default annotation
                ? never // if T[K] has a Default annotation, skip it
                : // if T[K] is not a function, not optional, and does not have a Default annotation, include it
                  K]: Creatable<T[K]>;
      } & {
        // build an object with optional keys from T
        [K in keyof T as T[K] extends (...args: any) => any // check if T[K] is a function
          ? never // if T[K] is a function, skip it
          : K extends Creatable.IgnoredKeys
            ? never
            : K extends Creatable.OptionalKeys // check if K is an optional key
              ? K
              : T[K] extends undefined // check if T[K] is optional
                ? K // if T[K] is optional, include it
                : HasAnnotation<T[K], Default<unknown, any>> extends true // check if T[K] has a Default annotation
                  ? K // if T[K] has a Default annotation, include it
                  : // if T[K] is not optional, and does not have a Default annotation, skip it
                    never]?: T[K] extends Default<infer T, any> ? T : Creatable<T[K]>;
      }
    : T;

export namespace Creatable {
  export type IgnoredKeys = '_id';
  export type OptionalKeys = 'createdAt' | 'updatedAt';
}
