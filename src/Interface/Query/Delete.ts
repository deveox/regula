import { Collection } from '@/Interface/Collection.js'
import { Db } from '../Db.js'
import { Transaction } from '../Transaction.js'
import { Filter } from './Filter.js'
import { Model } from '@/Interface/Model.js'
import { Connection } from '../index.js'

export abstract class Delete<M extends Model, PK extends keyof M> extends Filter<M> {
  abstract singleton: Db
  readonly collection: Collection<M, PK>
  constructor(config: Delete.Config<M, PK>) {
    super()
    this.collection = config.collection
  }
  abstract $one(db: Connection): Promise<void>
  async one(db: Connection = this.singleton): Promise<M | undefined> {
    const m = await this.collection.select().where(this).one(db)
    if (m) {
      if (this.collection.beforeDelete || this.collection.afterDelete) {
        const tx = db.tx()
        try {
          await this.collection.beforeDelete?.(tx, m)
          await this.$one(db)
          await this.collection.afterDelete?.(tx, m)
          if (!(db instanceof Transaction)) {
            // do not commit external transaction
            tx.commit()
          }
        } catch (e) {
          if (!(db instanceof Transaction)) {
            // do not rollback external transaction
            tx.rollback()
          }
          throw e
        }
      } else {
        await this.$one(db)
      }
    }
    return m
  }
  abstract $many(db: Connection): Promise<void>
  async many(db: Connection = this.singleton): Promise<M[]> {
    const ms = await this.collection.select().where(this).many(db)
    if (this.collection.beforeDelete || this.collection.afterDelete) {
      const tx = db.tx()
      try {
        if (this.collection.beforeDelete) {
          for (const m of ms) {
            await this.collection.beforeDelete(tx, m)
          }
        }
        await this.$many(db)
        if (this.collection.afterDelete) {
          for (const m of ms) {
            await this.collection.afterDelete?.(tx, m)
          }
        }
      } catch (e) {
        if (!(db instanceof Transaction)) {
          // do not rollback external transaction
          tx.rollback()
        }
        throw e
      }
    }
    return ms
  }
}

export namespace Delete {
  export interface Config<M extends Model, PK extends keyof M> {
    collection: Collection<M, PK>
  }
}
