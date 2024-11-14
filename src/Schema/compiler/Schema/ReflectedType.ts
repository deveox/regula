import { ReceiveType, ReflectionKind, Type, resolveReceiveType } from '@deepkit/type';
import { Annotations, getAnnotations } from '../annotations/index.js';

/**
 * Wrapper arround `@deepkit/type` `Type` to provide a more user-friendly API
 */
export class ReflectedType<T extends Type = Type> {
  /**
   * Wrapped `@deepkit/type` `Type`
   */
  readonly $: T;
  /**
   * Meta annotations of the type
   *
   * This includes only annotations that provided by ORM
   */
  readonly annotations?: Annotations;
  constructor(type: T) {
    this.$ = type;
    this.annotations = getAnnotations(this.$);
  }

  toString(): string {
    return ReflectedType.toString(this.$);
  }

  static toString(type: Type): string {
    switch (type.kind) {
      case ReflectionKind.never:
        return 'never';
      case ReflectionKind.void:
        return 'void';
      case ReflectionKind.symbol:
        return 'symbol';
      case ReflectionKind.null:
        return 'null';
      case ReflectionKind.undefined:
        return 'undefined';
      case ReflectionKind.regexp:
        return 'RegExp';
      case ReflectionKind.promise:
        return 'Promise';
      case ReflectionKind.literal:
        switch (typeof type.literal) {
          case 'string':
            return `'${type.literal}'`;
          case 'symbol':
            return type.literal.toString();
          default:
            return `${type.literal}`;
        }
      case ReflectionKind.any:
        return 'any';
      case ReflectionKind.unknown:
        return 'unknown';
      case ReflectionKind.bigint:
        return 'bigint';
      case ReflectionKind.templateLiteral:
        return 'Template Literal';
      case ReflectionKind.string:
        return 'string';
      case ReflectionKind.number:
        return 'number';
      case ReflectionKind.boolean:
        return 'boolean';
      case ReflectionKind.array:
        return `Array<${ReflectedType.toString(type.type)}>`;
      case ReflectionKind.union:
        return type.types.map(ReflectedType.toString).join(' | ');
      case ReflectionKind.intersection:
        return type.types.map(ReflectedType.toString).join(' & ');
      case ReflectionKind.tuple:
        return `[${type.types.map(ReflectedType.toString).join(', ')}]`;
      case ReflectionKind.tupleMember:
        return `tupleMember`;
      case ReflectionKind.class:
        return `class ${type.classType.name}`;
      case ReflectionKind.enum:
        return `enum ${ReflectedType.toString(type.indexType)}`;
      case ReflectionKind.enumMember:
        return `enumMember`;
      case ReflectionKind.object:
        return 'object';
      case ReflectionKind.method:
        return 'method';
      case ReflectionKind.function:
        return 'function';
      case ReflectionKind.parameter:
        return 'parameter';
      case ReflectionKind.typeParameter:
        return 'typeParameter';
      case ReflectionKind.callSignature:
        return 'callSignature';
      case ReflectionKind.indexSignature:
        return 'indexSignature';
      case ReflectionKind.infer:
        return 'infer';
      case ReflectionKind.methodSignature:
        return 'methodSignature';
      case ReflectionKind.objectLiteral:
        return 'objectLiteral';
      case ReflectionKind.property:
        return 'property';
      case ReflectionKind.propertySignature:
        return 'propertySignature';
      case ReflectionKind.rest:
        return 'rest';
    }
  }

  /**
   * Create a new `ReflectedType` instance with a generic type
   *
   * Parameter `type` will be resolved by `@deepkit/type` via reflection, you shouldn't specify it.
   *
   * Learn more: [DeepKit Docs](https://deepkit.io/documentation/runtime-types/reflection#receive-type-information)
   *
   * @example
   * const t = ReflectedType.of<string>()
   */
  static of<T>(type?: ReceiveType<T>) {
    const received = resolveReceiveType(type);
    return new ReflectedType(received);
  }
}
