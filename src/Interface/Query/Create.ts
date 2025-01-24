import { Transaction } from '../Transaction.js'
import { Db } from '../Db.js'
import { Collection } from '@/Interface/Collection.js'
import { Model } from '@/Interface/Model.js'
import { Connection } from '../index.js'

export abstract class Create<M extends Model, PK extends keyof M> {
  abstract singleton: Db
  collection: Collection<M, PK>
  constructor(config: Create.Config<M, PK>) {
    this.collection = config.collection
  }
  protected abstract $one(db: Connection, data: Model.Creatable<M>): Promise<M>
  async one(data: Model.Creatable<M>, db: Connection = this.singleton): Promise<M> {
    data.createdAt = new Date()
    if (this.collection.beforeCreate || this.collection.afterCreate) {
      const tx = db.tx()
      try {
        await this.collection.beforeCreate?.(tx, data)
        const m = await this.$one(tx, data)
        await this.collection.afterCreate?.(tx, m)
        if (!(db instanceof Transaction)) {
          // do not commit external transaction
          tx.commit()
        }
        return m
      } catch (e) {
        if (!(db instanceof Transaction)) {
          // do not rollback external transaction
          tx.rollback()
        }
        throw e
      }
    } else {
      return this.$one(db, data)
    }
  }
  protected abstract $many(db: Connection, data: Model.Creatable<M>[]): Promise<M[]>
  async many(data: Model.Creatable<M>[], db: Connection = this.singleton): Promise<M[]> {
    for (const d of data) {
      d.createdAt = new Date()
    }
    if (this.collection.beforeCreate || this.collection.afterCreate) {
      const tx = db.tx()
      try {
        for (const d of data) {
          await this.collection.beforeCreate?.(tx, d)
        }
        const ms = await this.$many(tx, data)
        for (const m of ms) {
          await this.collection.afterCreate?.(tx, m)
        }
        if (!(db instanceof Transaction)) {
          // do not commit external transaction
          tx.commit()
        }
        return ms
      } catch (e) {
        if (!(db instanceof Transaction)) {
          // do not rollback external transaction
          tx.rollback()
        }
        throw e
      }
    } else {
      return this.$many(db, data)
    }
  }
}

export namespace Create {
  export interface Config<M extends Model, PK extends keyof M> {
    collection: Collection<M, PK>
  }
}
