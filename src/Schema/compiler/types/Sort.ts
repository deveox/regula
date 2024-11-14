import { Flatten } from './Flatten.js';

export type Sort<T> = { [K in keyof Flatten<T>]: Sort.Order | { $meta: any } };

export namespace Sort {
  export type Order = 1 | -1;
}
