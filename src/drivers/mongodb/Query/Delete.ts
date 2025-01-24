import { Interface } from '@/Interface/index.js'
import { Model } from '@/Interface/Model.js'
import { db, Db } from '../Db.js'
import { Transaction } from '../Transaction.js'
import { Filter } from './Filter.js'
import mongodb from 'mongodb'

export class Delete<M extends Model> extends Interface.Query.Delete<M> {
  singleton = db
  async $one(conn: Db | Transaction): Promise<void> {
    const db = conn.db
    const filter = Filter.fromQueryFilter(this)
    await db
      .collection(this.collection.name)
      .deleteOne(filter as mongodb.Filter<mongodb.Document>, { session: conn instanceof Transaction ? conn.session : undefined })
  }
  async $many(conn: Db | Transaction): Promise<void> {
    const db = conn.db
    const filter = Filter.fromQueryFilter(this)
    await db
      .collection(this.collection.name)
      .deleteMany(filter as mongodb.Filter<mongodb.Document>, { session: conn instanceof Transaction ? conn.session : undefined })
  }
}
