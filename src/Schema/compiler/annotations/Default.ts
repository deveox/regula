import { Creatable } from '../types/Creatable.js';
import { TypeAnnotation } from './TypeAnnotation.js';

export const DefaultKey = '__dbDefault';
/**
 * Adds a default value to a field.
 *
 * @example
 * class User {
 *   name: Default<string, 'user'>
 * }
 * // mongoose equivalent:
 * const User = new Schema({
 *  name: {  type: String, default: 'user' }
 * })
 * // typegoose equivalent:
 * class User {
 *   /@prop({ default: 'user' })
 *   name: string
 * }
 */
export type Default<T, V extends Creatable<T>> = T & TypeAnnotation<typeof DefaultKey, V>;
