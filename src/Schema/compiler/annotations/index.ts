import { type Type, metaAnnotation } from '@deepkit/type';
import type { HasAnnotationType } from './TypeAnnotation.js';

/**
 * Annotation for a type.
 */
export interface Annotation {
  name: string;
  options: Type[];
}

/**
 * Mapped annotations for a type.
 */
export interface Annotations extends Record<string, Annotation['options']> {}

/**
 * Extracts meta annotations from a type if possible.
 *
 * Meta annotations are any custom annotations defined in this file using the `TypeAnnotation` type.
 */
export function getAnnotations(t: Type): Annotations | undefined {
  const arr = t.annotations?.[metaAnnotation.symbol];
  if (!arr) return undefined;
  const annotations: Annotations = {};
  for (const a of arr) {
    annotations[a.name] = a.options;
  }
  return annotations;
}

export type RemoveAnnotations<T> = HasAnnotationType<T, string> extends true ? Omit<T, '__meta' | '__t'> : T;
