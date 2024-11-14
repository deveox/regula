import { TypeAnnotation } from './TypeAnnotation.js';

export const ComputedDefaultKey = '__dbComputedDefault';

export type ComputedDefault = TypeAnnotation<typeof ComputedDefaultKey>;
