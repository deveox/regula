// @ts-nocheck missing types
import { forIn } from '@/utils/index.js';
import { AbstractClassType } from '@deepkit/core';
import * as mongodb from 'mongodb';
import mongoose from 'mongoose';
import { Err } from '../express-extended/Error.js';
import { Document } from './Document.js';
import { register } from './Schema/index.js';
import { Ref } from './annotations/Ref.js';
import { BulkWrite } from './types/BulkWrite.js';
import { Creatable } from './types/Creatable.js';
import { Filter } from './types/Filter.js';
import { Flatten } from './types/Flatten.js';
import { Query } from './types/Query.js';
import { QueryOptions } from './types/QueryOptions.js';
import { Updatable } from './types/Updatable.js';

/**
 * @reflection false
 */
export class Collection<D extends Document> {
  static register<D extends Document>(c: AbstractClassType<D>, config?: Collection.Config<D>): Collection<D> {
    const schema = register(c).mongoose.type;
    if (config?.indexes) {
      for (const index of config.indexes) {
        const idx: mongoose.IndexDefinition = {};
        forIn(index.columns, (key, value) => {
          if (value) {
            idx[key] = value;
          }
        });
        schema.index(idx, index.options);
      }
    }
    const model = mongoose.model<D>(c.name, schema);
    return new Collection<D>(model);
  }

  $: mongoose.Model<D>;
  constructor(model: mongoose.Model<D>) {
    this.$ = model;
  }

  bulkWrite(
    writes: BulkWrite<D>[],
    options: mongoose.MongooseBulkWriteOptions & { ordered: false }
  ): Promise<mongodb.BulkWriteResult & { mongoose?: { validationErrors: Error[] } }>;
  bulkWrite(writes: BulkWrite<D>[], options?: mongoose.MongooseBulkWriteOptions): Promise<mongodb.BulkWriteResult>;
  bulkWrite(
    writes: BulkWrite<D>[],
    options?: mongoose.MongooseBulkWriteOptions
  ): Promise<mongodb.BulkWriteResult> | Promise<mongodb.BulkWriteResult & { mongoose?: { validationErrors: Error[] } }> {
    return this.$.bulkWrite(writes as any, options as any);
  }

  // bulkSave(documents: D[], options?: mongoose.MongooseBulkSaveOptions): Promise<mongodb.BulkWriteResult>

  countDocuments(filter?: Filter<D>, options?: (mongodb.CountOptions & mongoose.MongooseBaseQueryOptions<D>) | null): Query<number, D> {
    return new Query(this.$.countDocuments(filter as mongoose.FilterQuery<D>, options));
  }

  create(doc: Creatable<D>): Promise<D> {
    return this.$.create(doc);
  }

  deleteMany(
    filter?: Filter<D>,
    options?: (mongodb.DeleteOptions & mongoose.MongooseBaseQueryOptions<D>) | null
  ): Query<mongodb.DeleteResult, D> {
    return new Query(this.$.deleteMany(filter as mongoose.FilterQuery<D>, options));
  }

  deleteOne(
    filter?: Filter<D>,
    options?: (mongodb.DeleteOptions & mongoose.MongooseBaseQueryOptions<D>) | null
  ): Query<mongodb.DeleteResult, D> {
    return new Query(this.$.deleteOne(filter as mongoose.FilterQuery<D>, options));
  }

  findById(id: string): Query<D | null, D> {
    return new Query(this.$.findById(id));
  }

  findOne(filter?: Filter<D>, options?: QueryOptions<D> | null): Query<D | null, D> {
    return new Query(this.$.findOne(filter as mongoose.FilterQuery<D>, undefined, options));
  }

  find(filter?: Filter<D>, options?: QueryOptions<D> | null | undefined): Query<D[], D> {
    return new Query(this.$.find(filter as mongoose.FilterQuery<D>, undefined, options));
  }

  findByIdAndDelete(id?: string, options?: QueryOptions<D> | null): Query<D | null, D> {
    return new Query(this.$.findByIdAndDelete(id, options));
  }

  findByIdAndUpdate(id: string, update: Updatable<D>, options: QueryOptions<D> & { upsert: true } & mongoose.ReturnsNewDoc): Query<D, D>;
  findByIdAndUpdate(id?: string, update?: Updatable<D>, options?: QueryOptions<D>): Query<D | null, D>;
  findByIdAndUpdate(id?: string, update?: Updatable<D>, options?: QueryOptions<D>): Query<D | null, D> | Query<D, D> {
    return new Query(this.$.findByIdAndUpdate(id, update, options));
  }

  findOneAndDelete(filter?: Filter<D> | null, options?: QueryOptions<D> | null): Query<D | null, D> {
    return new Query(this.$.findOneAndDelete(filter as mongoose.FilterQuery<D>, options));
  }

  findOneAndUpdate(
    filter: Filter<D>,
    update: Updatable<D>,
    options: QueryOptions<D> & { upsert: true } & mongoose.ReturnsNewDoc
  ): Query<D, D>;
  findOneAndUpdate(filter?: Filter<D>, update?: Updatable<D>, options?: QueryOptions<D> | null): Query<D | null, D>;
  findOneAndUpdate(filter?: Filter<D>, update?: Updatable<D>, options?: QueryOptions<D> | null): Query<D | null, D> | Query<D, D> {
    return new Query(this.$.findOneAndUpdate(filter as mongoose.FilterQuery<D>, update, options));
  }

  updateMany(
    filter?: Filter<D>,
    update?: Updatable<D> | mongoose.UpdateWithAggregationPipeline,
    options?: (mongodb.UpdateOptions & mongoose.MongooseUpdateQueryOptions<D>) | null
  ): Query<mongoose.UpdateWriteOpResult, D> {
    return new Query(this.$.updateMany(filter as mongoose.FilterQuery<D>, update, options));
  }

  updateOne(
    filter?: Filter<D>,
    update?: Updatable<D> | mongoose.UpdateWithAggregationPipeline,
    options?: (mongodb.UpdateOptions & mongoose.MongooseUpdateQueryOptions<D>) | null
  ): Query<mongoose.UpdateWriteOpResult, D> {
    return new Query(this.$.updateOne(filter as mongoose.FilterQuery<D>, update, options));
  }

  where<K extends keyof Flatten<D> & string>(path: K, val?: Flatten<D>[K]): Query<D[], D> {
    return new Query(this.$.where(path, val));
  }

  distinct<K extends Flatten.Keys<D> & string>(field: K, filter?: Filter<D>): Query<Flatten.Value<D, K>[], D> {
    return new Query(this.$.distinct(field, filter as mongoose.FilterQuery<D>) as mongoose.Query<Flatten.Value<D, K>[], D>);
  }

  async unref(ref: Ref<D>): Promise<D> {
    if (typeof ref === 'string') {
      const res = await this.$.findById(ref);
      if (!res) {
        throw Err.new(`Referenced ${this.$.name} #${ref} not found`, 404);
      }
      return res;
    }
    return ref;
  }
}

export namespace Collection {
  export interface Index<D extends Document> {
    columns: Index.Columns<D>;
    options?: mongoose.IndexOptions;
  }
  export namespace Index {
    export type Columns<D extends Document> = {
      [K in Flatten.Keys<D>]?: mongoose.IndexDirection;
    };
  }

  export interface Config<D extends Document> {
    indexes?: Index<D>[];
  }
}
