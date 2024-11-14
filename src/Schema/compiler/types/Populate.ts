import mongoose from 'mongoose';
import { Ref } from '../annotations/Ref.js';
import { QueryOptions } from './QueryOptions.js';

export type Populated<T, Keys extends Ref.Keys<T>> = T & {
  [K in keyof T & string as K extends Keys ? K : never]: Ref.Populated<T[K]>;
};

export namespace Populated {
  export interface Options<T, K extends Ref.Keys<T>> extends Omit<mongoose.PopulateOptions, 'populate' | 'model'> {
    path: K;
    select?: keyof Ref.PopulatedSignature<T[K]>;
    options?: QueryOptions<T>;
    /**
     * Use `Populated.new()` instead.
     * We can't use native object notation because it's not possible
     * to provide type checking for nested `populate` options.
     * @example
     * // Instead of:
     * model.populate([{
     *  path: 'org',
     *  populate: [{ // <- this is not type checked
     *   path: 'plan',
     *  }, {
     *   path: 'plans'
     *  }]
     * }, 'orgs'])
     * // Do:
     * model.populate(
     *  Populated.set(
     *    'org',
     *     p => p.set('plan').and('plans')
     *  ).and('orgs')
     * ).populate('orgs')
     *
     * @deprecated
     */
    populate?: never;
  }
}
