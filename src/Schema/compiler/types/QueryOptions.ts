import mongoose from 'mongoose';
import { Sort } from './Sort.js';

/**
 * Improved version of the Mongoose `QueryOptions` interface.
 * TODO: improve types
 * Provides better type safety.
 */
export interface QueryOptions<T> extends mongoose.QueryOptions {
  arrayFilters?: { [key: string]: any }[];
  comment?: any;
  fields?: any | string;
  /**
   * Not type safe
   * @deprecated use `lean()` method instead
   */
  lean?: false;

  overwriteDiscriminatorKey?: boolean;
  projection?: mongoose.ProjectionType<T>;
  sort?: Sort<T>;
  /**
   * Not type safe
   * @deprecated
   */
  includeResultMetadata?: false;
}
