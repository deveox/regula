import { AbstractClassType } from '@deepkit/core';
import { ReflectionClass, ReflectionKind } from '@deepkit/type';
import { Class } from './Class.js';
import { ReflectedType } from './ReflectedType.js';
import { UnsupportedTypeError } from './errors.js';

/**
 *
 * Gets a mongoose schema from a TypeScript class via Reflection
 *
 * Powered by `@deepkit/types`
 *
 * @example
 * class User {
 *   name!: string
 * }
 * console.log(register(User))
 * // mongoose.Schema({ name: { type: String } })
 */
export function register<T>(cls: AbstractClassType<T>, config?: Class.Config): Class {
  const c = ReflectionClass.from(cls);
  if (c.type.kind !== ReflectionKind.class) {
    throw new UnsupportedTypeError('schema', 'class');
  }
  return Class.new({ name: c.type.classType.name, type: new ReflectedType(c.type) }, config);
}
