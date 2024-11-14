import { Buffer } from 'node:buffer';
import { TypeAnnotation } from './TypeAnnotation.js';
export const MongoBufferKey = '__dbBuffer';
/**
 * MongoBuffer type is a representation of a MongoDB/Node Buffer.
 *
 * @example
 * class User {
 *   avatar: MongoBuffer
 * }
 *
 * // mongoose equivalent:
 * const User = new Schema({
 *  avatar: Buffer
 * })
 */
export type MongoBuffer = Buffer & TypeAnnotation<typeof MongoBufferKey>;
