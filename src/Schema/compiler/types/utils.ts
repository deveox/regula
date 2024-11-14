import { Buffer } from 'node:buffer';
import { HasAnnotationType } from '../annotations/TypeAnnotation.js';
export type OmitNever<T> = { [K in keyof T as T[K] extends never | undefined ? never : K]: T[K] };

export type AnyFix<T> = 0 extends 1 & T ? unknown : T;

// export interface Numbers {
//   0: 1
//   1: 2
//   2: 3
//   3: 4
//   4: 5
//   5: 6
//   6: 7
//   7: 8
//   8: 9
//   9: 10
//   10: 11
//   11: 12
//   12: 13
//   13: 14
//   14: 15
//   15: 16
//   16: 17
//   17: 18
//   18: 19
//   19: 20
// }

// export type Next<N extends number> = N extends keyof Numbers ? Numbers[N] : never

type _IsObject<T> = 0 extends 1 & T
  ? false // if value is any, it's not an object
  : T extends any[]
    ? false // if value is an array, it's not an object
    : T extends Date | Buffer | RegExp | Error
      ? false // if value is a built-in object, it's not an object
      : HasAnnotationType<T, string> extends false
        ? NonNullable<T> extends Record<string, any>
          ? true // if value is an object, it's an object
          : false
        : false;

export type IsObject<T> = _IsObject<T> extends true ? true : false;
