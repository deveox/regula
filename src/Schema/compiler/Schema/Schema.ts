import { ReflectionVisibility } from '@deepkit/type';
import mongoose from 'mongoose';
import { ReflectedType } from './ReflectedType.js';
import { UnsupportedKeyTypeError, UnsupportedTypeError, WrongModifierError, WrongTypeError, WrongVisibilityError } from './errors.js';
import { Visibility } from './visibility.js';

/**
 * Schema class for all schema types
 *
 * If you want to implement custom Schema type, you should extend it.
 */
export abstract class Schema {
  /**
   * Name of the property/class
   */
  readonly name?: Schema.Options['name'];
  /**
   * Parent schema if applicable
   *
   * e.g. string property in class will have class schema as parent
   */
  readonly parent?: Schema.Options['parent'];
  /**
   * `@deepkit/type` reflected type
   */
  readonly type: Schema.Options['type'];

  protected constructor(options: Schema.Options) {
    this.name = options.name;
    this.parent = options.parent;
    this.type = options.type;
  }

  /**
   * Returns nested path of the schema (e.g. MyClass.key1.key2.test)
   *
   */
  get path(): string {
    if (this.parent) {
      if (this.parent.path) {
        if (this.name) {
          return `${this.parent.path}.${this.name}`;
        }
        return this.parent.path;
      }
    }
    return this.name || '';
  }

  /**
   *
   * Returns instance of `UnsupportedKeyTypeError` with provided parameters. Path will be taken from the Schema instance.
   * @example
   * class MySchema extends Schema {
   *    test() {
   *      throw this.unsupportedKeyType('number', 'Optional details')
   *     // result: [MySchema.key] has unsupported key type: number. Only string keys are supported. Optional details
   *   }
   * }
   */
  protected unsupportedKeyType(type: string, message?: string) {
    return new UnsupportedKeyTypeError(this.path, type, message);
  }

  /**
   *
   * Returns instance of `UnsupportedTypeError` with provided parameters. Path will be taken from the Schema instance.
   * @example
   * class MySchema extends Schema {
   *    test() {
   *      throw this.unsupportedType('never', 'Optional details')
   *      // result: [MySchema.key] unsupported schema type: never. Optional details
   *    }
   * }
   */
  protected unsupportedType(type: string = this.type.toString(), message: string = '') {
    return new UnsupportedTypeError(
      this.path,
      type,
      this.parent ? `Either add private/protected modifier or change type. ${message}` : message
    );
  }

  /**
   *
   * Returns instance of `WrongTypeError` with provided parameters. Path will be taken from the Schema instance.
   * @example
   * class MySchema extends Schema {
   *   test() {
   *      throw this.wrongType('string', 'number', 'Optional details')
   *     // result: [MySchema.key] has wrong schema type: string. Should be number. Optional details
   *   }
   * }
   *
   */
  protected wrongType(type: string, wanted: string, message?: string) {
    return new WrongTypeError(this.path, type, wanted, message);
  }

  /**
   *
   * Returns instance of `WrongVisibilityError` with provided parameters. Path will be taken from the Schema instance.
   * @example
   * class MySchema extends Schema {
   *  test() {
   *   throw this.wrongVisibility(ReflectionVisibility.private, 'public', 'protected')
   *   // result: [MySchema.key] has wrong visibility: private. Should be public or protected.
   *  }
   * }
   */
  protected wrongVisibility(actual: ReflectionVisibility, ...wanted: Visibility[]) {
    return new WrongVisibilityError(this.path, actual, ...wanted);
  }

  /**
   * Returns instance of `WrongModifierError` with provided parameters. Path will be taken from the Schema instance.
   * @example
   * class MySchema extends Schema {
   *   test() {
   *     throw this.wrongModifier('optional', 'required', 'Optional details')
   *     // result:  [MySchema.key] is optional but should be required. Optional details
   *   }
   * }
   */
  protected wrongModifier(actual: 'optional' | 'required', wanted: 'optional' | 'required', message?: string) {
    return new WrongModifierError(this.path, actual, wanted, message);
  }

  /**
   * Contains Mongoose Schema of this Schema instance
   */
  abstract mongoose: mongoose.SchemaTypeOptions<unknown>;
}

export namespace Schema {
  export interface Options {
    /**
     * Name of the property/class
     */
    name?: string;
    /**
     * Parent schema if any
     */
    parent?: Schema;
    /**
     * `@deepkit/type` reflected type
     */
    type: ReflectedType;
  }

  export interface Config {
    discriminatorKey?: string;
  }
}
