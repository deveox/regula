import { Filter } from './Filter.js'
import { Db } from '../Db.js'
import { Collection } from '@/Interface/Collection.js'
import { Model } from '@/Interface/Model.js'
import { Connection } from '../index.js'

export abstract class Select<M extends Model, PK extends keyof M> extends Filter<M> {
  abstract singleton: Db
  collection: Collection<M, PK>
  constructor(config: Select.Config<M, PK>) {
    super()
    this.collection = config.collection
  }
  protected abstract $one(db: Connection): Promise<M | undefined>
  async one(db: Connection = this.singleton): Promise<M | undefined> {
    await this.collection.beforeSelect?.(db, this)
    const m = await this.$one(db)
    if (m) {
      await this.collection.afterSelect?.(db, m)
    }
    return m
  }
  protected abstract $many(db: Connection): Promise<M[]>
  async many(db: Connection = this.singleton): Promise<M[]> {
    await this.collection.beforeSelect?.(db, this)
    const ms = await this.$many(db)
    for (const m of ms) {
      await this.collection.afterSelect?.(db, m)
    }
    return ms
  }
}

export namespace Select {
  export interface Config<M extends Model, PK extends keyof M> {
    collection: Collection<M, PK>
  }
}
