import mongoose from 'mongoose';
import { Flatten } from './Flatten.js';
import { OmitNever } from '@/tools/types.js';

/**
 * A type representing a filter query for mongoose.
 */
export type Filter<T> = _Filter<Flatten<T>>;

type _Filter<T> =
  | {
      // if T is an object, itterate over each key of T
      [P in keyof T]?: T[P] | Filter.Selector<T[P]>;
    }// if T is an object, itterate over each key of T // if T is an object, itterate over each key of T // if T is an object, itterate over each key of T // if T is an object, itterate over each key of T // if T is an object, itterate over each key of T
  | Filter.RootSelector<T>;

export namespace Filter {
  /**
   * Primitive filter type, e.g. string, number, boolean, etc.
   *
   * Also includes array.
   */
  export type Primitive<T> =
    | T
    // not that we add RootSelector only when Object notation
    // (`Selector<T>`) is used, otherwise intersection with primitive
    // type will bloat resulting type with primitive methods
    | (Selector<T> & RootSelector<T>);

  /**
   * Selectors for filtering, that can be applied only at the root
   * level.
   */
  export interface RootSelector<T> {
    /** https://www.mongodb.com/docs/manual/reference/operator/query/and/#op._S_and */
    $and?: _Filter<T>[];
    /** https://www.mongodb.com/docs/manual/reference/operator/query/nor/#op._S_nor */
    $nor?: _Filter<T>[];
    /** https://www.mongodb.com/docs/manual/reference/operator/query/or/#op._S_or */
    $or?: _Filter<T>[];
    /** https://www.mongodb.com/docs/manual/reference/operator/query/text */
    $text?: {
      $search: string;
      $language?: string;
      $caseSensitive?: boolean;
      $diacriticSensitive?: boolean;
    };
    /**  https://www.mongodb.com/docs/manual/reference/operator/query/where/#op._S_where */
    // biome-ignore lint/complexity/noBannedTypes: This is how it is defined in mongoose
    $where?: string | ((args: any) => any) | Function;
    /** https://www.mongodb.com/docs/manual/reference/operator/query/comment/#op._S_comment */
    $comment?: string;
  }

  /**
   * Helper interface for Selector type.
   *
   * All properties that are not applicable for a given `T` are marked
   * as `never`. Later, they are removed using `OmitNever` utility
   * type.
   */
  interface _Selector<T>
    extends Omit<mongoose.QuerySelector<T>, '$not' | '$expr' | '$jsonSchema' | '$all' | '$elemMatch' | '$gt' | '$gte' | '$lt' | '$lte'> {
    $gt?: T extends number ? number : never;
    $lt?: T extends number ? number : never;
    $lte?: T extends number ? number : never;
    $gte?: T extends number ? number : never;
    $not?: T extends string ? Selector<T> | RegExp : Selector<T>;
    // Array
    $all?: T extends (infer El)[] ? El[] | { $elemMatch: Selector<El> | El } : never;
    $elemMatch?: T extends (infer El)[] ? Filter<El> | El : never;
  }

  /**
   * Selectors for filtering that can be applied at field level.
   */
  export type Selector<T> = OmitNever<_Selector<T>>;

  /**
   * Type for filtering array elements.
   */
  export type ElementMatch<T> = T extends (infer El)[] ? Filter<El> | El : never;
}
