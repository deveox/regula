import { Flatten } from 'mongodb'

/**
 * Works like built-in `Partial<T>` but also applies to nested properties.
 */
export type DeepPartial<T> = T extends Record<string, any>
  ? {
      [P in keyof T & string]?: DeepPartial<T[P]>
    }
  : Partial<T>

/**
 * A type representing an update query for mongoose. Enhanced version
 * of `mongoose.UpdateQuery`.
 *
 * Intersection between deep partial of the document and specific
 * MongoDB update operators.
 */

export type Updatable<T> = _Updatable<Flatten<T>>
type _Updatable<T> = DeepPartial<T> & {
  /** @see https://www.mongodb.com/docs/manual/reference/operator/update-field/ */
  $currentDate?: DeepPartial<T>
  $inc?: DeepPartial<T>
  $min?: DeepPartial<T>
  $max?: DeepPartial<T>
  $mul?: DeepPartial<T>
  $rename?: Record<string, string>
  $set?: DeepPartial<T>
  $setOnInsert?: DeepPartial<T>
  $unset?: DeepPartial<T>

  /** @see https://www.mongodb.com/docs/manual/reference/operator/update-array/ */
  $addToSet?: DeepPartial<T>
  $pop?: DeepPartial<T>
  $pull?: DeepPartial<T>
  $push?: DeepPartial<T>
  $pullAll?: DeepPartial<T>

  /** @see https://www.mongodb.com/docs/manual/reference/operator/update-bitwise/ */
  $bit?: DeepPartial<T>
}
