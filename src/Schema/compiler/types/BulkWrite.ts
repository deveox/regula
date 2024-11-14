import * as mongodb from 'mongodb';
import { Creatable } from './Creatable.js';
import { Filter } from './Filter.js';
import { Updatable } from './Updatable.js';

/**
 * Configuration for bulk write operations in mongoose.
 */
export type BulkWrite<T> =
  | {
      insertOne: BulkWrite.Insert<T>;
    }
  | {
      replaceOne: BulkWrite.Replace<T>;
    }
  | {
      updateOne: BulkWrite.Update<T>;
    }
  | {
      updateMany: BulkWrite.Update<T>;
    }
  | {
      deleteOne: BulkWrite.Delete<T>;
    }
  | {
      deleteMany: BulkWrite.Delete<T>;
    };

export namespace BulkWrite {
  /**
   * Configuration for bulk `insert` operation in mongoose.
   */
  export interface Insert<T> {
    document: mongodb.OptionalId<Creatable<T>>;
    /** When false, do not add timestamps. When true, overrides the `timestamps` option set in the `bulkWrite` options. */
    timestamps?: boolean;
  }

  /**
   * Configuration for bulk `replace` operation in mongoose.
   */
  export interface Replace<T> {
    /** The filter to limit the replaced document. */
    filter: Filter<T>;
    /** The document with which to replace the matched document. */
    replacement: mongodb.WithoutId<Creatable<T>>;
    /** Specifies a collation. */
    collation?: mongodb.CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: mongodb.Hint;
    /** When true, creates a new document if no document matches the query. */
    upsert?: boolean;
    /** When false, do not add timestamps. When true, overrides the `timestamps` option set in the `bulkWrite` options. */
    timestamps?: boolean;
  }

  /**
   * Configuration for bulk `update` operation in mongoose.
   */
  export interface Update<T> {
    /** The filter to limit the updated documents. */
    filter: Filter<T>;
    /** A document or pipeline containing update operators. */
    update: Updatable<T>;
    /** Specifies a collation. */
    collation?: mongodb.CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: mongodb.Hint;
    /** When true, creates a new document if no document matches the query. */
    upsert?: boolean;
    /** When false, do not add timestamps. When true, overrides the `timestamps` option set in the `bulkWrite` options. */
    timestamps?: boolean;
  }

  /**
   * Configuration for bulk `delete` operation in mongoose.
   */
  export interface Delete<T> {
    /** The filter to limit the deleted documents. */
    filter: Filter<T>;
    /** Specifies a collation. */
    collation?: mongodb.CollationOptions;
    /** The index to use. If specified, then the query system will only consider plans using the hinted index. */
    hint?: mongodb.Hint;
  }
}
