// @ts-nocheck missing types
import mongoose, { FilterQuery } from 'mongoose';
import { Document } from '../Document.js';
import { Filter } from './Filter.js';
import { Flatten } from './Flatten.js';
import { QueryOptions } from './QueryOptions.js';
import { Sort } from './Sort.js';
import { Updatable } from './Updatable.js';
/**
 * Override of the Mongoose Query interface with significantly
 * improved type safety.
 *
 * Should always extend `mongoose.Query` to ensure compatibility with
 * Mongoose methods and avoid duplicated definitions.
 *
 * The most improvements achieved by utilizing the `Flatten`,
 * `Updatable` and `Creatable` types. You can learn more about them
 * in their respective files.
 */
export class Query<R, D extends Document> {
  /**
   * Native Mongoose Query object.
   *
   * Use this property to access the original Mongoose Query methods.
   *
   * @deprecated not type safe
   */
  $: mongoose.Query<R, D>;
  then: Promise<R>['then'];
  catch: Promise<R>['catch'];
  finally: Promise<R>['finally'];
  constructor(query: mongoose.Query<R, D>) {
    this.$ = query;
    this.then = query.then.bind(query);
    this.catch = query.catch.bind(query);
    this.finally = query.finally.bind(query);
  }
  exec(): Promise<R> {
    return this.$.exec();
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<mongoose.Unpacked<R>> {
    return this.$[Symbol.asyncIterator]();
  }

  all<K extends keyof Flatten<D> & string>(path: K, val: Flatten<D>[K] extends (infer R)[] ? R[] : never[]): this {
    this.$.all(path, val);
    return this;
  }
  and(array: Filter<D>[]) {
    this.$.and(array as FilterQuery<D>[]);
    return this;
  }

  deleteMany(filter?: Filter<D>, options?: QueryOptions<D>): this {
    this.$.deleteMany(filter as FilterQuery<D>[], options);
    return this;
  }

  deleteOne(filter?: Filter<D>, options?: QueryOptions<D>): this {
    this.$.deleteOne(filter as FilterQuery<D>[], options);
    return this;
  }

  elemMatch<K extends keyof Flatten<D>>(path: K, val: Filter.ElementMatch<Flatten<D>[K]>): this {
    this.$.elemMatch(path, val);
    return this;
  }

  estimatedDocumentCount(options?: QueryOptions<D>): Query<number, D> {
    return new Query(this.$.estimatedDocumentCount(options));
  }

  exists(path: keyof Flatten<D>, val: boolean): this {
    this.$.exists(path, val);
    return this;
  }

  find(filter?: Filter<D>, projection?: null, options?: QueryOptions<D>): Query<D[], D> {
    return new Query(this.$.find(filter as FilterQuery<D>[], projection, options));
  }

  findOne(filter?: Filter<D>, projection?: null, options?: QueryOptions<D>): Query<D | null, D> {
    return new Query(this.$.findOne(filter as FilterQuery<D>[], projection, options));
  }

  findOneAndDelete(filter?: Filter<D>, options?: QueryOptions<D>): Query<D | null, D> {
    return new Query(this.$.findOneAndDelete(filter as FilterQuery<D>[], options));
  }

  findOneAndUpdate(
    filter: Filter<D>,
    update: Updatable<D>,
    options: QueryOptions<D> & { includeResultMetadata: true }
  ): Query<mongoose.ModifyResult<D>, D>;
  findOneAndUpdate(
    filter: Filter<D>,
    update: Updatable<D>,
    options: QueryOptions<D> & { upsert: true } & mongoose.ReturnsNewDoc
  ): Query<D, D>;
  findOneAndUpdate(filter?: Filter<D>, update?: Updatable<D>, options?: QueryOptions<D>): Query<D | null, D>;
  findOneAndUpdate(
    filter?: Filter<D>,
    update?: Updatable<D>,
    options?: QueryOptions<D>
  ): Query<mongoose.ModifyResult<D>, D> | Query<D | null, D> | Query<D, D> {
    return new Query(this.$.findOneAndUpdate(filter as FilterQuery<D>, update, options));
  }

  findById(id: string, projection?: mongoose.ProjectionType<D> | null, options?: QueryOptions<D>): Query<D | null, D>;
  findById(id: string, projection?: mongoose.ProjectionType<D> | null): Query<D | null, D>;
  findById(id: string): Query<D | null, D>;
  findById(id: string, projection?: mongoose.ProjectionType<D> | null, options?: QueryOptions<D>): Query<D | null, D> {
    return new Query(this.$.findById(id, projection, options));
  }

  findByIdAndDelete(id: string, options: QueryOptions<D> & { includeResultMetadata: true }): Query<mongoose.ModifyResult<D>, D>;
  findByIdAndDelete(id: string, options?: QueryOptions<D>): Query<D | null, D>;
  findByIdAndDelete(id: string, options?: QueryOptions<D>): Query<mongoose.ModifyResult<D>, D> | Query<D | null, D> {
    return new Query(this.$.findByIdAndDelete(id, options));
  }

  findByIdAndUpdate(
    id: string,
    update: Updatable<D>,
    options: QueryOptions<D> & { includeResultMetadata: true }
  ): Query<mongoose.ModifyResult<D>, D>;
  findByIdAndUpdate(id: string, update: Updatable<D>, options: QueryOptions<D> & { upsert: true } & mongoose.ReturnsNewDoc): Query<D, D>;
  findByIdAndUpdate(id: string, update: Updatable<D>): Query<D | null, D>;
  findByIdAndUpdate(
    id?: string,
    update?: Updatable<D>,
    options?: QueryOptions<D> | null
  ): Query<mongoose.ModifyResult<D>, D> | Query<D | null, D> | Query<D, D> {
    return new Query(this.$.findByIdAndUpdate(id, update, options));
  }

  gt<K extends keyof Flatten<D>>(path: K, val: Flatten<D>[K] extends number ? number : never): this {
    this.$.gt(path, val);
    return this;
  }

  gte<K extends keyof Flatten<D>>(path: K, val: Flatten<D>[K] extends number ? number : never): this {
    this.$.gte(path, val);
    return this;
  }

  in<K extends keyof Flatten<D>>(path: K, val: Flatten<D>[K][]): this {
    this.$.in(path, val);
    return this;
  }

  lt<K extends keyof Flatten<D>>(path: K, val: Flatten<D>[K] extends number ? number : never): this {
    this.$.lt(path, val);
    return this;
  }

  lte<K extends keyof Flatten<D>>(path: K, val: Flatten<D>[K] extends number ? number : never): this {
    this.$.lte(path, val);
    return this;
  }

  transform<MappedType>(fn: (doc: R) => MappedType): Query<MappedType, D> {
    return new Query(this.$.transform(fn));
  }

  mod<K extends Flatten.Keys<D>>(path: K, val: Flatten.Value<D, K> extends number ? [number, number] : never): this {
    // @ts-expect-error wrong type for `val` in mongoose
    this.$.mod(path, val);
    return this;
  }

  ne<K extends keyof Flatten<D>>(path: K, val: Flatten<D>[K]): this {
    this.$.ne(path, val);
    return this;
  }

  nin<K extends keyof Flatten<D>>(path: K, val: Flatten<D>[K][]): this {
    this.$.nin(path, val);
    return this;
  }

  nor(array: Filter<D>[]): this {
    this.$.nor(array as FilterQuery<D>[]);
    return this;
  }

  or(array: Filter<D>[]): this {
    this.$.or(array as FilterQuery<D>[]);
    return this;
  }

  regex(path: keyof Flatten<D>, val: RegExp): this {
    this.$.regex(path, val);
    return this;
  }

  replaceOne(filter?: Filter<D>, replacement?: D, options?: QueryOptions<D> | null): Query<D, D> {
    return new Query(this.$.replaceOne(filter as FilterQuery<D>[], replacement, options));
  }

  set<K extends Flatten.Keys<D>>(path: K, val: Flatten.Value<D, K>): this {
    this.$.set(path, val);
    return this;
  }

  size<K extends keyof Flatten<D>>(path: K, val: Flatten<D>[K] extends any[] ? number : never): this {
    this.$.size(path, val);
    return this;
  }

  slice<K extends keyof Flatten<D>>(path: K, val: Flatten<D>[K] extends any[] ? number | [number, number] : never): this {
    this.$.slice(path, val);
    return this;
  }

  sort(arg: Sort<D>, options?: { override?: boolean }): this {
    this.$.sort(arg, options);
    return this;
  }

  updateMany(
    filter?: Filter<D>,
    update?: Updatable<D> | mongoose.UpdateWithAggregationPipeline,
    options?: QueryOptions<D> | null
  ): Query<mongoose.UpdateWriteOpResult, D> {
    return new Query(this.$.updateMany(filter as FilterQuery<D>[], update, options));
  }

  updateOne(
    filter?: Filter<D>,
    update?: Updatable<D> | mongoose.UpdateWithAggregationPipeline,
    options?: QueryOptions<D> | null
  ): Query<mongoose.UpdateWriteOpResult, D> {
    return new Query(this.$.updateOne(filter as FilterQuery<D>[], update, options));
  }

  where<K extends Flatten.Keys<D>>(path: K, val?: Filter<D>) {
    this.$.where(path, val);
    return this;
  }
  $where(argument: (this: D) => boolean): this {
    this.$.$where(argument);
    return this;
  }
  countDocuments(criteria?: Filter<D>, options?: QueryOptions<D>) {
    return new Query(this.$.countDocuments(criteria as FilterQuery<D>, options));
  }

  distinct<K extends Flatten.Keys<D>>(field: K, filter?: Filter<D>): Query<Flatten.Value<D, K>[], D> {
    return new Query(this.$.distinct(field, filter as FilterQuery<D>) as mongoose.Query<Flatten.Value<D, K>[], D>);
  }

  /**
   * it's not recommended to use this method
   * because it's not type safe and performance benefits are negligible.
   *
   * Do it only when you work with thousands of documents and don't need
   * mongoose features.
   */
  lean<LR = mongoose.GetLeanResultType<D, R, 'find'>>(val?: boolean): Query<R extends null ? LR | null : LR, D> {
    return new Query(this.$.lean(val));
  }
}
