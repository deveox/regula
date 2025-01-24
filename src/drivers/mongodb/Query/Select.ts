import { db, Db } from '../Db.js'
import mongodb from 'mongodb'
import { Filter } from './Filter.js'
import { Interface } from '@/Interface/index.js'
import { Transaction } from '../Transaction.js'
import { Model } from '@/Interface/Model.js'

export class Select<M extends Model> extends Interface.Query.Select<M> {
  singleton = db
  async $one(conn: Db | Transaction): Promise<M | undefined> {
    const db = conn.db
    const filter = Filter.fromQueryFilter(this)
    const res = await db
      .collection(this.collection.name)
      .findOne(filter as mongodb.Filter<mongodb.Document>, { session: conn instanceof Transaction ? conn.session : undefined })
    if (!res) return undefined
    return res as unknown as M
  }
  async $many(conn: Db | Transaction): Promise<M[]> {
    const db = conn.db
    const filter = Filter.fromQueryFilter(this)
    const res = await db
      .collection(this.collection.name)
      .find(filter as mongodb.Filter<mongodb.Document>, { session: conn instanceof Transaction ? conn.session : undefined })
      .toArray()
    return res as unknown as M[]
  }
}
