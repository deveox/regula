import { TypeAnnotation } from './TypeAnnotation.js';

export const MongoIdKey = '__dbId';
/**
 * MongoId type is a representation of a MongoDB ObjectId.
 *
 * In contrast to the mongoose ObjectId, this type is a string, but stored as an ObjectId in DB.
 * Under the hood, it adds a getter for the MongoDB ObjectId.
 *
 * @example
 * class User {
 *  someId: MongoId
 * }
 * // access example
 * u.someId // '5f3f3f3f3f3f3f3f3f3f3f3f'
 * // mongoose equivalent:
 * const User = new Schema({
 *   someId: mongoose.Schema.Types.ObjectId
 * })
 * // access example
 * u.someId._id // '5f3f3f3f3f3f3f3f3f3f3f3'
 *
 */
export type MongoId = string & TypeAnnotation<typeof MongoIdKey>;
