import { Transaction } from '../Transaction.js'
import { Db } from '../Db.js'
import { Collection } from '@/Interface/Collection.js'
import { Model } from '@/Interface/Model.js'
import { Connection } from '../index.js'

export abstract class Update<M extends Model, PK extends keyof M> {
  abstract singleton: Db
  collection: Collection<M, PK>
  constructor(config: Update.Config<M, PK>) {
    this.collection = config.collection
  }
  protected abstract $one(db: Connection, model: M): Promise<void>
  async one(model: M, db: Connection = this.singleton): Promise<M> {
    model.updatedAt = new Date()
    if (db.db.settings?.strictUpdates && !model.$changes.has()) {
      throw new Error('Model has no changes')
    }
    if (this.collection.beforeUpdate || this.collection.beforeCreate) {
      const tx = db.tx()
      try {
        await this.collection.beforeUpdate?.(tx, model)
        await this.$one(tx, model)
        await this.collection.afterUpdate?.(tx, model)
        if (!(db instanceof Transaction)) {
          // do not commit external transaction
          tx.commit()
        }
        model.$changes.clear()
        return model
      } catch (e) {
        if (!(db instanceof Transaction)) {
          // do not rollback external transaction
          tx.rollback()
        }
        throw e
      }
    } else {
      await this.$one(db, model)
      model.$changes.clear()
      return model
    }
  }
  protected abstract $many(db: Connection, models: M[]): Promise<void>
  async many(models: M[], db: Connection = this.singleton): Promise<M[]> {
    for (const m of models) {
      m.updatedAt = new Date()
    }
    if (this.collection.beforeUpdate || this.collection.afterUpdate) {
      const tx = db.tx()
      try {
        for (const d of models) {
          await this.collection.beforeUpdate?.(tx, d)
        }
        await this.$many(tx, models)
        for (const m of models) {
          await this.collection.afterUpdate?.(tx, m)
        }
        if (!(db instanceof Transaction)) {
          // do not commit external transaction
          tx.commit()
        }
        for (const m of models) {
          m.$changes.clear()
        }
        return models
      } catch (e) {
        if (!(db instanceof Transaction)) {
          // do not rollback external transaction
          tx.rollback()
        }
        throw e
      }
    } else {
      await this.$many(db, models)
      for (const m of models) {
        m.$changes.clear()
      }
      return models
    }
  }
}

export namespace Update {
  export interface Config<M extends Model, PK extends keyof M> {
    collection: Collection<M, PK>
  }
}
