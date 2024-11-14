/**
 * Adds a type annotation to a field.
 *
 * First argument is the unique name of the annotation, second argument is the options.
 *
 * Follows `@deepkit/type` annotation pattern.
 */
export type TypeAnnotation<T extends string, Options = never> = {
  __meta?: [T, Options];
  __t?: T;
};

export type HasAnnotation<T, A> = A extends {
  __t?: infer AT;
}
  ? T extends {
      __t?: infer TT;
    }
    ? AT extends TT
      ? true
      : false
    : false
  : false;

export type HasAnnotationType<T, AnnotationKey extends string> = T extends { __t?: infer TT }
  ? TT extends AnnotationKey
    ? true
    : false
  : false;
